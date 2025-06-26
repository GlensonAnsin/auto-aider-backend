import express from 'express';
import { addVehicle, getVehicles, updateVehicle, removeVehicle } from '../controllers/vehicleController';

const router = express.Router();

router.post('/add-vehicle', addVehicle);
router.post('/get-vehicles', getVehicles);
router.post('/update-vehicle', updateVehicle);
router.post('/delete-vehicle', removeVehicle);

export default router;