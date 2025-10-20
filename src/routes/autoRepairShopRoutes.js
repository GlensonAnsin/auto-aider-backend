import express from 'express';
import { getAllRepairShops, createRepairShop, loginRepairShop, getRepairShopInfo, updateRepairShopInfo, getShopInfoForChat, updateRatings, updateAvailability, checkNumOrEmailRS, resetPassRS, getAllUnAppShops } from '../controllers/autoRepairShopController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', createRepairShop);
router.get('/get-all', getAllRepairShops);
router.get('/get-all-unapproved-shops', authMiddleware, getAllUnAppShops);
router.post('/login', loginRepairShop);
router.get('/get-repair-shop-info', authMiddleware, getRepairShopInfo);
router.patch('/update-repair-shop-info', authMiddleware, updateRepairShopInfo);
router.get('/get-shop-info-chat/:repair_shop_id', authMiddleware, getShopInfoForChat);
router.patch('/update-ratings', authMiddleware, updateRatings);
router.patch('/update-availability', authMiddleware, updateAvailability);
router.post('/check-existence-rs', checkNumOrEmailRS);
router.patch('/reset-pass-rs', resetPassRS);

export default router;