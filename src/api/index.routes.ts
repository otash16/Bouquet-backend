import { Router } from 'express';
import dashboardRoutes from './dashboard/index.routes.ts';
import clientRoutes from './client/index.routes.ts';

const router = Router();

router.use('/client', clientRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
