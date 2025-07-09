import epxress from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { generateSignature } from '../controllers/cloudinaryController.js';

const router = epxress.Router();

router.post('/generate-signature', generateSignature);

export default router;