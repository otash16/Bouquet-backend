import { Router } from 'express';
import clientRoutes from './client/index.routes.ts';
import dashboardRoutes from './dashboard/index.routes.ts';

const router = Router();

router.use('/client', clientRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
