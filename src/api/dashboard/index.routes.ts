import { Router } from 'express';
import adminAuthMiddleware from '../shared/middlewares/adminAuthMiddleware.ts';

const router = Router();

// Public routes (login, refresh, logout)
// router.use('/admins', adminRoutes);

// Protected routes — auth kerak
router.use(adminAuthMiddleware);

// router.use('/shops', shopRoutes);
// router.use('/flowers', flowerRoutes);
// router.use('/categories', categoryRoutes);
// router.use('/upload', uploadRoutes);

export default router;
