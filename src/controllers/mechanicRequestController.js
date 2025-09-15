import { AutoRepairShop, MechanicRequest, User, Vehicle, VehicleDiagnostic } from '../models/index.js';

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
    });

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
  const { requestIDs, reason_rejected, scanReference, year, make, model, userID } = req.body;

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

      req.io.emit('requestRejected', { requestIDs, reason_rejected });

      const tokens = await SavePushToken.findAll({ where: { repair_shop_id: userID } });
      const tokenValues = tokens.map(t => t.token);

      await sendPushToTokens(tokenValues, {
        title: 'Request Rejected',
        body: `Repair request for ${year} ${make} ${model} has been rejected.`,
        data: { scanReference },
      });

      res.sendStatus(200);
    };

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ACCEPT REQUEST
export const acceptRequest = async (req, res) => {
  const repair_shop_id = req.user.repair_shop_id;
  const { requestIDs, scanReference, year, make, model, userID } = req.body;

  try {
    const repShop = await AutoRepairShop.findOne({ where: { repair_shop_id: repair_shop_id } });

    if (repShop) {
      for (const item of requestIDs) {
        const request = await MechanicRequest.findOne({ where: { mechanic_request_id: item } });
        await request.update({
          status: "Ongoing",
        });
      };

      req.io.emit('requestAccepted', { requestIDs });

      const tokens = await SavePushToken.findAll({ where: { repair_shop_id: userID } });
      const tokenValues = tokens.map(t => t.token);

      await sendPushToTokens(tokenValues, {
        title: 'Request Accepted',
        body: `Repair request for ${year} ${make} ${model} has been accepted.`,
        data: { scanReference },
      });

      res.sendStatus(200);
    };

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// REQUEST COMPLETED
export const requestCompleted = async (req, res) => {
  const repair_shop_id = req.user.repair_shop_id;
  const { requestIDs, repair_procedure, completed_on, scanReference, year, make, model, userID } = req.body;

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

      req.io.emit('requestCompleted', { requestIDs, repair_procedure, completed_on });

      const tokens = await SavePushToken.findAll({ where: { repair_shop_id: userID } });
      const tokenValues = tokens.map(t => t.token);

      await sendPushToTokens(tokenValues, {
        title: 'Request Completed',
        body: `Repair request for ${year} ${make} ${model} has been completed.`,
        data: { scanReference },
      });

      res.sendStatus(200);
    };

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}