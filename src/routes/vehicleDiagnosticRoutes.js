import express from 'express';
import {
  addVehicleDiagnostic,
  getVehicleDiagnostics,
  getOnVehicleDiagnostic,
  getOnSpecificVehicleDiagnostic,
  deleteVehicleDiagnostic,
  deleteAllVehicleDiagnostics,
  countScansToday
} from '../controllers/vehicleDiagnosticController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add-vehicle-diagnostic', authMiddleware, addVehicleDiagnostic);
router.get('/get-vehicle-diagnostics', authMiddleware, getVehicleDiagnostics);
router.get('/get-on-vehicle-diagnostic/:vehicle_id/:scan_reference', authMiddleware, getOnVehicleDiagnostic);
router.get('/get-on-spec-vehicle-diagnostic/:vehicle_diagnostic_id', authMiddleware, getOnSpecificVehicleDiagnostic)
router.patch('/delete-vehicle-diagnostic', authMiddleware, deleteVehicleDiagnostic);
router.patch('/delete-all-vehicle-diagnostics', authMiddleware, deleteAllVehicleDiagnostics);
router.get('/count-scans-today', authMiddleware, countScansToday);

export default router;