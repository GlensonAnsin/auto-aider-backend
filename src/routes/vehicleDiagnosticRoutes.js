import express from 'express';
import {
  addVehicleDiagnostic,
  getVehicleDiagnostics,
  getOnVehicleDiagnosticCO,
  getOnVehicleDiagnosticRS,
  getOnSpecificVehicleDiagnostic,
  deleteVehicleDiagnostic,
  deleteAllVehicleDiagnostics,
  countScansToday,
  getRecentScansCO,
  getRecentScansRS,
} from '../controllers/vehicleDiagnosticController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/add-vehicle-diagnostic', authMiddleware, addVehicleDiagnostic);
router.get('/get-vehicle-diagnostics', authMiddleware, getVehicleDiagnostics);
router.get('/get-on-vehicle-diagnostic-co/:vehicle_id/:scan_reference', authMiddleware, getOnVehicleDiagnosticCO);
router.get('/get-on-vehicle-diagnostic-rs/:vehicle_id/:scan_reference', authMiddleware, getOnVehicleDiagnosticRS);
router.get('/get-on-spec-vehicle-diagnostic/:vehicle_diagnostic_id', authMiddleware, getOnSpecificVehicleDiagnostic)
router.patch('/delete-vehicle-diagnostic', authMiddleware, deleteVehicleDiagnostic);
router.patch('/delete-all-vehicle-diagnostics', authMiddleware, deleteAllVehicleDiagnostics);
router.get('/count-scans-today', authMiddleware, countScansToday);
router.get('/get-recent-scans-co/:vehicle_id', authMiddleware, getRecentScansCO);
router.get('/get-recent-scans-rs/:vehicle_id', authMiddleware, getRecentScansRS);

export default router;