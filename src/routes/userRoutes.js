import express from 'express';
import { getAllUsers, createUser, loginUser, refreshAccessToken, getUserInfo, updateUserInfo, changePass, getUserInfoForChat, checkNumOrEmailCO, resetPassCO, loginAdmin, getAdminInfo, updateMapTypeCO, updatePushNotifCO, deleteAccountCO } from "../controllers/userController.js";
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', createUser);
router.get('/get-all', getAllUsers);
router.post('/login', loginUser);
router.post('/login-admin', loginAdmin);
router.get('/get-user-info', authMiddleware, getUserInfo);
router.get('/get-admin-info', authMiddleware, getAdminInfo);
router.patch('/update-user-info', authMiddleware, updateUserInfo);
router.patch('/change-password', authMiddleware, changePass);
router.get('/get-user-info-chat/:user_id', authMiddleware, getUserInfoForChat);
router.post('/refresh-token', refreshAccessToken);
router.post('/check-existence-co', checkNumOrEmailCO);
router.patch('/reset-pass-co', resetPassCO);
router.post('/update-map-type', authMiddleware, updateMapTypeCO);
router.post('/update-push-notif', authMiddleware, updatePushNotifCO);
router.get('/delete-account', authMiddleware, deleteAccountCO);

export default router;