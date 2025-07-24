import express from 'express';
import { addRequest } from '../controllers/mechanicRequestController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add-request', authMiddleware, addRequest);

export default router;