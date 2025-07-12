import epxress from 'express';
import { generateSignature, deleteProfilePic, generateSignatureForShopImages } from '../controllers/cloudinaryController.js';

const router = epxress.Router();

router.post('/generate-signature', generateSignature);
router.post('/delete-profile', deleteProfilePic);
router.post('/generate-signature-shop-images', generateSignatureForShopImages);

export default router;