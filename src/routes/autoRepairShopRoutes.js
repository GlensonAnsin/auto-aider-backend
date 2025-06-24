import express, { Router } from 'express';
import { getAllRepairShops, createRepairShop } from '../controllers/autoRepairShopController.js';

const router = express.Router();

router.post('/signup', createRepairShop);
router.get('/get-all', getAllRepairShops);

export default router;