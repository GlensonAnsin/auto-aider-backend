import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getConversationForCarOwner, getConversationForShop, sendMessage, getAllConversationsCO, getAllConversationsRS, updateMessageStatus } from '../controllers/chatMessageController.js';

const router = express.Router();

router.get('/get-conversation-co/:repair_shop_id', authMiddleware, getConversationForCarOwner);
router.get('/get-conversation-rs/:user_id', authMiddleware, getConversationForShop);
router.get('/get-all-chats-co', authMiddleware, getAllConversationsCO);
router.get('/get-all-chats-rs', authMiddleware, getAllConversationsRS);
router.post('/send-message', sendMessage);
router.patch('/update-message-status', updateMessageStatus);

export default router;