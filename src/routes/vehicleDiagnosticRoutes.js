import express from 'express';
import { addVehicleDiagnostic, getAllVehicleDiagnostic, removeVehicleDiagnostic  } from '../controllers/vehicleDiagnosticController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add-vehicle-diagnostic', authMiddleware, addVehicleDiagnostic);
router.get('/get-vehicle-diagnostic/:vehicle_id/:scan_reference', authMiddleware, getAllVehicleDiagnostic);
router.delete('/delete-vehicle-diagnostic/:vehicle_diagnostic_id', authMiddleware, removeVehicleDiagnostic);

export default router;