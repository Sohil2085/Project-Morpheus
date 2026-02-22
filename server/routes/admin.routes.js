import express from 'express';
const router = express.Router();
import * as adminController from '../controllers/admin.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

router.use(requireAuth);
router.use(requireRole(['ADMIN']));

router.get('/kyc/pending', adminController.getPendingKyc);
router.post('/kyc/:id/approve', adminController.approveKyc);
router.post('/kyc/:id/reject', adminController.rejectKyc);

export default router;