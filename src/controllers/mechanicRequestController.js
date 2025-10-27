import { AutoRepairShop, MechanicRequest, User, Vehicle, VehicleDiagnostic, Notification, SavePushToken } from '../models/index.js';
import { sendPushToTokens } from "../utils/pushNotif.js";
import dayjs from 'dayjs';

// ADD REQUEST
export const addRequest = async (req, res) => {
  const user_id = req.user.user_id;
  const {
    vehicle_diagnostic_id,
    repair_shop_id,
    repair_procedure,
    request_datetime,
    status,
    is_deleted,
    completed_on,
    rejected_reason,
    longitude,
    latitude,
    is_rated,
    request_type,
    service_type,
  } = req.body;

  try {
    const user = await User.findOne({ where: { user_id: user_id } });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await MechanicRequest.create({
      vehicle_diagnostic_id,
      repair_shop_id,
      repair_procedure,
      request_datetime,
      status,
      is_deleted,
      completed_on,
      rejected_reason,
      longitude,
      latitude,
      is_rated,
      request_type,
      service_type,
    });

    const userRequest = await User.findOne({
      where: { user_id: user_id },
      include: [{
        model: Vehicle,
        required: true,
        include: [{
          model: VehicleDiagnostic,
          required: true,
          include: [{
            model: MechanicRequest,
            required: true,
          }],
        }],
      }],
    });

    req.io.emit(`newRequest-CO-${user_id}`, { userRequest });

    const shopRequest = await AutoRepairShop.findOne({
      where: { repair_shop_id: repair_shop_id },
      include: [{
        model: MechanicRequest,
        required: true,
        include: [{
          model: VehicleDiagnostic,
          required: true,
          include: [{
            model: Vehicle,
            required: true,
            include: [{
              model: User,
              required: true,
            }],
          }],
        }],
      }],
    });

    req.io.emit(`newRequest-RS-${repair_shop_id}`, { shopRequest });

    const tokens = await SavePushToken.findAll({ where: { repair_shop_id: repair_shop_id } });
    const tokenValues = tokens.map(t => t.token);

    await sendPushToTokens(tokenValues, {
      title: 'New Repair Request',
      body: `You got a new repair request from ${user.firstname} ${user.lastname}.`,
      data: {},
    });

    const newNotif = await Notification.create({
      user_id: null,
      repair_shop_id: repair_shop_id,
      title: 'New Repair Request',
      message: `You got a new repair request from ${user.firstname} ${user.lastname}.`,
      is_read: false,
      created_at: dayjs().format(),
    });

    req.io.emit(`newNotif-RS-${repair_shop_id}`, { newNotif });
    const unreadNotifs = await Notification.count({ where: { repair_shop_id: repair_shop_id, is_read: false } });
    req.io.emi(`newUnreadNotif-RS-${repair_shop_id}`, { unreadNotifs });
    res.sendStatus(201);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET REQUESTS
export const getRequestsForCarOwner = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const user = await User.findOne({
      where: { user_id },
      include: [{
        model: Vehicle,
        required: true,
        include: [{
          model: VehicleDiagnostic,
          required: true,
          include: [{
            model: MechanicRequest,
            required: true,
          }],
        }],
      }],
    });

    res.status(200).json(user);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getRequestsForRepairShop = async (req, res) => {
  const repair_shop_id = req.user.repair_shop_id;

  try {
    const repShop = await AutoRepairShop.findOne({
      where: { repair_shop_id },
      include: [{
        model: MechanicRequest,
        required: true,
        include: [{
          model: VehicleDiagnostic,
          required: true,
          include: [{
            model: Vehicle,
            required: true,
            include: [{
              model: User,
              required: true,
            }],
          }],
        }],
      }],
    });

    res.status(200).json(repShop);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// REJECT REQUEST
export const rejectRequest = async (req, res) => {
  const repair_shop_id = req.user.repair_shop_id;
  const { requestIDs, reason_rejected, year, make, model, userID } = req.body;

  try {
    const repShop = await AutoRepairShop.findOne({ where: { repair_shop_id: repair_shop_id } });

    if (repShop) {
      for (const item of requestIDs) {
        const request = await MechanicRequest.findOne({ where: { mechanic_request_id: item } });
        await request.update({
          status: "Rejected",
          reason_rejected: reason_rejected,
        });
      };

      req.io.emit(`requestRejected-CO-${userID}`, { requestIDs, reason_rejected });
      req.io.emit(`requestRejected-RS-${repair_shop_id}`, { requestIDs, reason_rejected });

      const tokens = await SavePushToken.findAll({ where: { user_id: userID } });
      const tokenValues = tokens.map(t => t.token);

      await sendPushToTokens(tokenValues, {
        title: 'Request Rejected',
        body: `Repair request for ${year} ${make} ${model} has been rejected.`,
        data: {},
      });

      const newNotif = await Notification.create({
        user_id: userID,
        repair_shop_id: null,
        title: 'Request Rejected',
        message: `Repair request for ${year} ${make} ${model} has been rejected.`,
        is_read: false,
        created_at: dayjs().format(),
      });

      req.io.emit(`newNotif-CO-${userID}`, { newNotif });
      const unreadNotifs = await Notification.count({ where: { user_id: userID, is_read: false } });
      req.io.emi(`newUnreadNotif-CO-${userID}`, { unreadNotifs });
      res.sendStatus(200);
    };

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ACCEPT REQUEST
export const acceptRequest = async (req, res) => {
  const repair_shop_id = req.user.repair_shop_id;
  const { requestIDs, year, make, model, userID } = req.body;

  try {
    const repShop = await AutoRepairShop.findOne({ where: { repair_shop_id: repair_shop_id } });

    if (repShop) {
      for (const item of requestIDs) {
        const request = await MechanicRequest.findOne({ where: { mechanic_request_id: item } });
        await request.update({
          status: "Ongoing",
        });
      };

      req.io.emit(`requestAccepted-CO-${userID}`, { requestIDs });
      req.io.emit(`requestAccepted-RS-${repair_shop_id}`, { requestIDs });

      const tokens = await SavePushToken.findAll({ where: { user_id: userID } });
      const tokenValues = tokens.map(t => t.token);

      await sendPushToTokens(tokenValues, {
        title: 'Request Accepted',
        body: `Repair request for ${year} ${make} ${model} has been accepted.`,
        data: {},
      });

      const newNotif = await Notification.create({
        user_id: userID,
        repair_shop_id: null,
        title: 'Request Accepted',
        message: `Repair request for ${year} ${make} ${model} has been accepted.`,
        is_read: false,
        created_at: dayjs().format(),
      });

      req.io.emit(`newNotif-CO-${userID}`, { newNotif });
      const unreadNotifs = await Notification.count({ where: { user_id: userID, is_read: false } });
      req.io.emi(`newUnreadNotif-CO-${userID}`, { unreadNotifs });
      res.sendStatus(200);
    };

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// REQUEST COMPLETED
export const requestCompleted = async (req, res) => {
  const repair_shop_id = req.user.repair_shop_id;
  const { requestIDs, repair_procedure, completed_on, vehicleID, year, make, model, userID, requestType } = req.body;

  try {
    const repShop = await AutoRepairShop.findOne({ where: { repair_shop_id: repair_shop_id } });

    if (repShop) {
      for (const item of requestIDs) {
        const request = await MechanicRequest.findOne({ where: { mechanic_request_id: item } });
        await request.update({
          status: "Completed",
          repair_procedure: repair_procedure,
          completed_on: completed_on,
        });
      };

      if (requestType === 'Preventive Maintenance Service') {
        const vehicle = await Vehicle.findOne({ where: { vehicle_id: vehicleID } });
        await vehicle.update({
          last_pms_trigger: dayjs().format()
        });
      }

      req.io.emit(`requestCompleted-CO-${userID}`, { requestIDs, repair_procedure, completed_on });
      req.io.emit(`requestCompleted-RS-${repair_shop_id}`, { requestIDs, repair_procedure, completed_on });

      const tokens = await SavePushToken.findAll({ where: { user_id: userID } });
      const tokenValues = tokens.map(t => t.token);

      if (repair_procedure === 'Repair unsuccessful') {
        await sendPushToTokens(tokenValues, {
          title: 'Request Unsuccessful',
          body: `Repair request for ${year} ${make} ${model} has been unsuccessful. Don't forget to rate the shop.`,
          data: {},
        });

        const newNotif = await Notification.create({
          user_id: userID,
          repair_shop_id: null,
          title: 'Request Unsuccessful',
          message: `Repair request for ${year} ${make} ${model} has been unsuccessful. Don't forget to rate the shop.`,
          is_read: false,
          created_at: dayjs().format(),
        });

        req.io.emit(`newNotif-CO-${userID}`, { newNotif });
      } else {
        await sendPushToTokens(tokenValues, {
          title: 'Request Successful',
          body: `Repair request for ${year} ${make} ${model} has been successful. Don't forget to rate the shop.`,
          data: {},
        });

        const newNotif = await Notification.create({
          user_id: userID,
          repair_shop_id: null,
          title: 'Request Successful',
          message: `Repair request for ${year} ${make} ${model} has been successful. Don't forget to rate the shop.`,
          is_read: false,
          created_at: dayjs().format(),
        });

        req.io.emit(`newNotif-CO-${userID}`, { newNotif });
      }

      const unreadNotifs = await Notification.count({ where: { user_id: userID, is_read: false } });
      req.io.emit(`newUnreadNotif-CO-${userID}`, { unreadNotifs });
      res.sendStatus(200);
    };

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};