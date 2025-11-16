import express from 'express';
import {
  addRequest,
  getRequestsForCarOwner,
  getRequestsForRepairShop,
  rejectRequest,
  acceptRequest,
  requestCompleted
} from '../controllers/mechanicRequestController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add-request', authMiddleware, addRequest);
router.get('/get-requests-co', authMiddleware, getRequestsForCarOwner);
router.get('/get-requests-rs', authMiddleware, getRequestsForRepairShop);
router.patch('/reject-request', authMiddleware, rejectRequest);
router.patch('/accept-request', authMiddleware, acceptRequest);
router.patch('/request-completed', authMiddleware, requestCompleted);

export default router;