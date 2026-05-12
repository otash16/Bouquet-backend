import { Router } from 'express';
import { validationHandler } from '../../../middlewares/index.ts';
import { catchAsync } from '../../../utilities/index.ts';
import adminAuthMiddleware from '../../shared/middlewares/adminAuthMiddleware.ts';
import superAdminGuard from '../../shared/middlewares/superAdminGuard.ts';
import * as AdminController from './admin.controller.ts';
import {
  changePasswordDto,
  createAdminDto,
  deleteAdminDto,
  getAdminByIdDto,
  getAdminsDto,
  signinDto,
  updateAdminDto,
} from './utils/admin.dto.ts';

const router = Router();

// ===== AUTH (public) =====
router.post('/signin', validationHandler(signinDto), catchAsync(AdminController.signin));
router.get('/refresh', catchAsync(AdminController.refresh));

// ===== AUTH MIDDLEWARE =====
router.use(adminAuthMiddleware);

// ===== ACCOUNT =====
router.get('/info', catchAsync(AdminController.info));
router.get('/logout', catchAsync(AdminController.logout));
router.patch(
  '/change-password',
  validationHandler(changePasswordDto),
  catchAsync(AdminController.changePassword)
);
router.get('/sessions', catchAsync(AdminController.getSessions));

// ===== ADMIN CRUD (faqat superadmin) =====
router.use(superAdminGuard);
router.get('/', validationHandler(getAdminsDto), catchAsync(AdminController.getAdmins));
router.post('/', validationHandler(createAdminDto), catchAsync(AdminController.createAdmin));
router.get('/:id', validationHandler(getAdminByIdDto), catchAsync(AdminController.getAdminById));
router.patch('/:id', validationHandler(updateAdminDto), catchAsync(AdminController.updateAdmin));
router.delete('/:id', validationHandler(deleteAdminDto), catchAsync(AdminController.deleteAdmin));

export default router;
