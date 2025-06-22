import express from 'express';
import { getAllUsers, createUser } from "../controllers/userController.js";

const router = express.Router();

router.post('/', createUser);
router.get('/', getAllUsers);

export default router;