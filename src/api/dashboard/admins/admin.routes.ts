import { Router } from 'express';
import { validationHandler } from '../../../middlewares/index.ts';
import { catchAsync } from '../../../utilities/index.ts';
import adminAuthMiddleware from '../../shared/middlewares/adminAuthMiddleware.ts';
import * as AdminController from './admin.controller.ts';
import { signinDto } from './utils/admin.dto.ts';

const router = Router();

// ===== AUTH (public) =====
router.post('/signin', validationHandler(signinDto), catchAsync(AdminController.signin));
router.get('/refresh', catchAsync(AdminController.refresh));

// ===== AUTH MIDDLEWARE =====
router.use(adminAuthMiddleware);

// ===== ACCOUNT =====
router.get('/info', catchAsync(AdminController.info));
router.get('/logout', catchAsync(AdminController.logout));

export default router;
