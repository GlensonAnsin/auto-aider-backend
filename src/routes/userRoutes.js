import express from 'express';
import { getAllUsers, createUser, loginUser, refreshAccessToken, getUserInfo } from "../controllers/userController.js";

const router = express.Router();

router.post('/signup', createUser);
router.get('/get-all', getAllUsers);

router.post('/login', loginUser);
router.post('/get-user-info', getUserInfo);
router.post('/refresh-token', refreshAccessToken);

export default router;