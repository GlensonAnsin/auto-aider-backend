import express from 'express';
import { getAllUsers, createUser, loginUser, refreshAccessToken, getUserInfo, updateUserInfo, changePass, getUserInfoForChat, checkNumOrEmailCO, resetPassCO, loginAdmin } from "../controllers/userController.js";
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', createUser);
router.get('/get-all', getAllUsers);
router.post('/login', loginUser);
router.post('/login-admin', loginAdmin);
router.get('/get-user-info', authMiddleware, getUserInfo);
router.patch('/update-user-info', authMiddleware, updateUserInfo);
router.patch('/change-password', authMiddleware, changePass);
router.get('/get-user-info-chat/:user_id', authMiddleware, getUserInfoForChat);
router.post('/refresh-token', refreshAccessToken);
router.post('/check-existence-co', checkNumOrEmailCO);
router.patch('/reset-pass-co', resetPassCO);

export default router;