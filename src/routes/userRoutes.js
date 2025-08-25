import express from 'express';
import { getAllUsers, createUser, loginUser, refreshAccessToken, getUserInfo, updateUserInfo, changePass, getUserInfoForChat } from "../controllers/userController.js";
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', createUser);
router.get('/get-all', getAllUsers);
router.post('/login', loginUser);
router.get('/get-user-info', authMiddleware, getUserInfo);
router.patch('/update-user-info', authMiddleware, updateUserInfo);
router.patch('/change-password', authMiddleware, changePass);
router.get('/get-user-info-chat/:user_id', authMiddleware, getUserInfoForChat);
router.post('/refresh-token', refreshAccessToken);

export default router;