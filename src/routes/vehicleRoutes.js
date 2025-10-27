import express from 'express';
import { addVehicle, getVehicles, getScannedVehicle, dismissPms, deleteVehicle } from '../controllers/vehicleController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add-vehicle', authMiddleware, addVehicle);
router.get('/get-vehicles', authMiddleware, getVehicles);
router.get('/get-scanned-vehicle/:vehicle_id', authMiddleware, getScannedVehicle);
router.patch('/dismiss-pms', authMiddleware, dismissPms);
router.patch('/delete-vehicle', authMiddleware, deleteVehicle);

export default router;