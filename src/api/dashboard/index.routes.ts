import { Router } from 'express';
import adminAuthMiddleware from '../shared/middlewares/adminAuthMiddleware.ts';
import adminRoutes from './admins/admin.routes.ts';
import categoryRoutes from './categories/category.routes.ts';

const router = Router();

// Public routes (login, refresh, logout)
router.use('/admins', adminRoutes);

// Protected routes — auth kerak
router.use(adminAuthMiddleware);
router.use('/categories', categoryRoutes);

// router.use('/shops', shopRoutes);
// router.use('/flowers', flowerRoutes);
// router.use('/upload', uploadRoutes);

export default router;
