import express from 'express';
import { getAllRepairShops, createRepairShop, loginRepairShop, getRepairShopInfo, updateRepairShopInfo, getShopInfoForChat } from '../controllers/autoRepairShopController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', createRepairShop);
router.get('/get-all', getAllRepairShops);
router.post('/login', loginRepairShop);
router.get('/get-repair-shop-info', authMiddleware, getRepairShopInfo);
router.patch('/update-repair-shop-info', authMiddleware, updateRepairShopInfo);
router.get('/get-shop-info-chat/:repair_shop_id', authMiddleware, getShopInfoForChat);

export default router;