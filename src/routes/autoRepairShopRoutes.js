import express from 'express';
import { getAllRepairShops, createRepairShop, loginRepairShop, getRepairShopInfo } from '../controllers/autoRepairShopController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', createRepairShop);
router.get('/get-all', getAllRepairShops);
router.post('/login', loginRepairShop);
router.get('/get-repair-shop-info', authMiddleware, getRepairShopInfo);

export default router;