import express from 'express';
import { addVehicle, getVehicles, updateVehicle, removeVehicle } from '../controllers/vehicleController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add-vehicle', authMiddleware, addVehicle);
router.get('/get-vehicles', authMiddleware, getVehicles);
router.patch('/update-vehicle', authMiddleware, updateVehicle);
router.delete('/delete-vehicle', authMiddleware, removeVehicle);

export default router;