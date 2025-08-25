import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getConversationForCarOwner, getConversationForShop } from '../controllers/chatMessageController.js';

const router = express.Router();

router.get('/get-conversation-co/:repair_shop_id', authMiddleware, getConversationForCarOwner);
router.get('/get-conversation-rs/:user_id', authMiddleware, getConversationForShop);

export default router;