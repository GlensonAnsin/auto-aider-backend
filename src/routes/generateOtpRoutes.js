import express from 'express';
import { generateOtp } from '../controllers/generateOtpController.js';

const router = express.Router();

router.post('/generate-otp', generateOtp);

export default router;