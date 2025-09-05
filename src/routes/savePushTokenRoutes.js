import express from 'express';
import { saveToken } from '../controllers/savePushTokenController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/save-push-token', authMiddleware, saveToken);

export default router;