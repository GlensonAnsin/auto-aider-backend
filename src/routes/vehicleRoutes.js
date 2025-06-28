import express from 'express';
import { addVehicle, getVehicles, removeVehicle } from '../controllers/vehicleController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add-vehicle', authMiddleware, addVehicle);
router.get('/get-vehicles', authMiddleware, getVehicles);
router.delete('/delete-vehicle/:vehicle_id', authMiddleware, removeVehicle);

export default router;