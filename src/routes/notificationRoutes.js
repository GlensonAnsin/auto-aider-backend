import express from 'express';
import { getNotificationsCO, getNotificationsRS, updateNotificationStatusCO, updateNotificationStatusRS, deleteNotificationCO, deleteNotificationRS } from '../controllers/notificationController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/get-notifications-co', authMiddleware, getNotificationsCO);
router.get('/get-notifications-rs', authMiddleware, getNotificationsRS);
router.patch('/update-notification-co', authMiddleware, updateNotificationStatusCO);
router.patch('/update-notification-rs', authMiddleware, updateNotificationStatusRS);
router.delete('/delete-notificaion-co', authMiddleware, deleteNotificationCO);
router.delete('/delete-notificaion-rs', authMiddleware, deleteNotificationRS);

export default router;