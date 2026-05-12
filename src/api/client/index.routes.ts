import { Router } from 'express';
import categoryRoutes from './categories/category.routes.ts';
import shopRoutes from './shops/shop.routes.ts';

const router = Router();

router.use('/categories', categoryRoutes);
router.use('/shops', shopRoutes);

// router.use('/flowers', flowerRoutes);

export default router;
