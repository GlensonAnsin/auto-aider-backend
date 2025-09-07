import express from 'express';
import { saveToken } from '../controllers/savePushTokenController.js';

const router = express.Router();

router.post('/save-push-token', saveToken);

export default router;