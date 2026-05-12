import { Router } from 'express';
import { catchAsync } from '../../../utilities/index.ts';
import * as StatsController from './stats.controller.ts';

const router = Router();

router.get('/', catchAsync(StatsController.getDashboardStats));

export default router;
