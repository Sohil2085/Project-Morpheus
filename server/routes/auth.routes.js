import express from 'express';
const router = express.Router();
import * as authController from '../controllers/auth.controller.js';

router.post('/signup', authController.signup);
router.post('/register', authController.signup); // Added for frontend compatibility
router.post('/login', authController.login);

export default router;
