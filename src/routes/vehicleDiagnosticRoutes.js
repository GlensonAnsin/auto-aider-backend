import express from 'express';
import { addVehicleDiagnostic, getOnVehicleDiagnostic, getOnSpecificVehicleDiagnostic, removeVehicleDiagnostic  } from '../controllers/vehicleDiagnosticController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add-vehicle-diagnostic', authMiddleware, addVehicleDiagnostic);
router.get('/get-on-vehicle-diagnostic/:vehicle_id/:scan_reference', authMiddleware, getOnVehicleDiagnostic);
router.get('/get-on-spec-vehicle-diagnostic/:vehicle_diagnostic_id', authMiddleware, getOnSpecificVehicleDiagnostic)
router.delete('/delete-vehicle-diagnostic/:vehicle_diagnostic_id', authMiddleware, removeVehicleDiagnostic);

export default router;