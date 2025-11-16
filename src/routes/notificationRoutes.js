import express from 'express';
import {
  getNotificationsCO,
  getNotificationsRS,
  updateNotificationStatusCO,
  updateNotificationStatusRS,
  deleteNotificationCO,
  deleteNotificationRS,
  countUnreadNotifCO,
  countUnreadNotifRS
} from '../controllers/notificationController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/get-notifications-co', authMiddleware, getNotificationsCO);
router.get('/get-notifications-rs', authMiddleware, getNotificationsRS);
router.get('/count-unread-notifs-co', authMiddleware, countUnreadNotifCO);
router.get('/count-unread-notifs-rs', authMiddleware, countUnreadNotifRS);
router.patch('/update-notification-co', authMiddleware, updateNotificationStatusCO);
router.patch('/update-notification-rs', authMiddleware, updateNotificationStatusRS);
router.delete('/delete-notification-co', authMiddleware, deleteNotificationCO);
router.delete('/delete-notification-rs', authMiddleware, deleteNotificationRS);

export default router;