import express from 'express';
import { addVehicle, getVehicles, getScannedVehicle, removeVehicle } from '../controllers/vehicleController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add-vehicle', authMiddleware, addVehicle);
router.get('/get-vehicles', authMiddleware, getVehicles);
router.get('/get-scanned-vehicle/:vehicle_id', authMiddleware, getScannedVehicle);
router.delete('/delete-vehicle/:vehicle_id', authMiddleware, removeVehicle);

export default router;