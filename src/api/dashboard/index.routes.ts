import { Router } from 'express';
import adminAuthMiddleware from '../shared/middlewares/adminAuthMiddleware.ts';
import adminRoutes from './admins/admin.routes.ts';
import categoryRoutes from './categories/category.routes.ts';
import flowerRoutes from './flowers/flower.routes.ts';
import shopRoutes from './shops/shop.routes.ts';
import subscriptionRoutes from './subscriptions/subscription.routes.ts';
import tariffRoutes from './tariffs/tariff.routes.ts';

const router = Router();

// Public routes (login, refresh, logout)
router.use('/admins', adminRoutes);

// Protected routes — auth kerak
router.use(adminAuthMiddleware);
router.use('/categories', categoryRoutes);
router.use('/shops', shopRoutes);
router.use('/flowers', flowerRoutes);
router.use('/tariffs', tariffRoutes);
router.use('/subscriptions', subscriptionRoutes);

export default router;
