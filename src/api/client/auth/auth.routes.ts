import { Router } from 'express';
import { catchAsync } from '../../../utilities/index.ts';
import userAuthMiddleware from '../../shared/middlewares/userAuthMiddleware.ts';
import * as AuthController from './auth.controller.ts';

const router = Router();

router.post('/', userAuthMiddleware, catchAsync(AuthController.telegramAuth));

export default router;
