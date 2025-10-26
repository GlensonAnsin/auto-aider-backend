import { Notification, User, AutoRepairShop } from "../models/index.js";

// GET ALL NOTIFICATIONS FOR CAR OWNER
export const getNotificationsCO = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const user = await User.findOne({ where: { user_id: user_id } });

    if (user) {
      const notifications = await Notification.findAll({ where: { user_id: user_id } });
      res.status(200).json(notifications);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// GET ALL NOTIFICATIONS FOR REPAIR SHOP
export const getNotificationsRS = async (req, res) => {
  const repair_shop_id = req.user.repair_shop_id;

  try {
    const shop = await AutoRepairShop.findAll({ where: { repair_shop_id: repair_shop_id } });

    if (shop) {
      const notifications = await Notification.findAll({ where: { repair_shop_id: repair_shop_id } });
      res.status(200).json(notifications);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// COUNT ALL UNREAD NOTIFICATION FROM CAR OWNER
export const countUnreadNotifCO = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const user = await User.findOne({ where: { user_id: user_id } });

    if (user) {
      const unreadNotifs = await Notification.count({ where: { user_id: user_id, is_read: false } });
      res.status(200).json(unreadNotifs);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// COUNT ALL UNREAD NOTIFICATION FROM REPAIR SHOP
export const countUnreadNotifRS = async (req, res) => {
  const repair_shop_id = req.user.repair_shop_id;

  try {
    const shop = await AutoRepairShop.findOne({ where: { repair_shop_id: repair_shop_id } });

    if (shop) {
      const unreadNotifs = await Notification.count({ where: { repair_shop_id: repair_shop_id, is_read: false } });
      res.status(200).json(unreadNotifs);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// UPDATE NOTIFICATION STATUS FOR CAR OWNER
export const updateNotificationStatusCO = async (req, res) => {
  const user_id = req.user.user_id;
  const { notificationID } = req.body;

  try {
    const user = await User.findOne({ where: { user_id: user_id } });

    if (user) {
      const notification = await Notification.findOne({ where: { notification_id: notificationID } });
      await notification.update({
        is_read: true,
      });
      res.sendStatus(200);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// UPDATE NOTIFICATION STATUS FOR REPAIR SHOP
export const updateNotificationStatusRS = async (req, res) => {
  const repair_shop_id = req.user.repair_shop_id;
  const { notificationID } = req.body;

  try {
    const shop = await AutoRepairShop.findOneA({ where: { repair_shop_id: repair_shop_id } });

    if (shop) {
      const notification = await Notification.findOne({ where: { notification_id: notificationID } });
      await notification.update({
        is_read: true,
      });
      res.sendStatus(200);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// DELETE NOTIFICATION FOR CAR OWNER
export const deleteNotificationCO = async (req, res) => {
  const user_id = req.user.user_id;
  const { notificationID } = req.body;

  try {
    const user = await User.findOne({ where: { user_id: user_id } });

    if (user) {
      const notification = await Notification.findOne({ where: { notification_id: notificationID } });
      await notification.destroy();
      res.sendStatus(200);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// DELETE NOTIFICATION FOR REPAIR SHOP
export const deleteNotificationRS = async (req, res) => {
  const repair_shop_id = req.user.repair_shop_id;
  const { notificationID } = req.body;

  try {
    const shop = await AutoRepairShop.findOne({ where: { repair_shop_id: repair_shop_id } });

    if (shop) {
      const notification = await Notification.findOne({ where: { notification_id: notificationID } });
      await notification.destroy();
      res.sendStatus(200);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};