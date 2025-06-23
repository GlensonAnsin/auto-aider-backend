import express, { Router } from 'express';
import { getAllRepairShops, createRepairShop } from '../controllers/autoRepairShopController.js';

const router = express.Router();

router.post('/', createRepairShop);
router.get('/', getAllRepairShops);

export default router;