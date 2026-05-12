import { Router } from 'express';
import authRoutes from './auth/auth.routes.ts';
import categoryRoutes from './categories/category.routes.ts';
import flowerRoutes from './flowers/flower.routes.ts';
import shopRoutes from './shops/shop.routes.ts';

const router = Router();

// Auth (Telegram initData → JWT)
router.use('/auth', authRoutes);

// Public routes
router.use('/categories', categoryRoutes);
router.use('/shops', shopRoutes);
router.use('/flowers', flowerRoutes);

export default router;
