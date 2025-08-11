import express from 'express';
import { addRequest, getRequestsForCarOwner, getRequestsForRepairShop } from '../controllers/mechanicRequestController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add-request', authMiddleware, addRequest);
router.get('/get-requests-co', authMiddleware, getRequestsForCarOwner);
router.get('/get-requests-rs', authMiddleware, getRequestsForRepairShop);

export default router;