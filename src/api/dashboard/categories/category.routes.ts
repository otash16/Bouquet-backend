import { Router } from 'express';
import { validationHandler } from '../../../middlewares/index.ts';
import { catchAsync } from '../../../utilities/index.ts';
import superAdminGuard from '../../shared/middlewares/superAdminGuard.ts';
import * as CategoryController from './category.controller.ts';
import {
  createCategoryDto,
  deleteCategoryDto,
  getCategoriesDto,
  getCategoryByIdDto,
  updateCategoryDto,
} from './utils/category.dto.ts';

const router = Router();

router.get('/', validationHandler(getCategoriesDto), catchAsync(CategoryController.getCategories));
router.get(
  '/:id',
  validationHandler(getCategoryByIdDto),
  catchAsync(CategoryController.getCategoryById)
);

// Faqat superadmin yaratishi/o'zgartirishi/o'chirishi mumkin
router.use(superAdminGuard);
router.post(
  '/',
  validationHandler(createCategoryDto),
  catchAsync(CategoryController.createCategory)
);
router.patch(
  '/:id',
  validationHandler(updateCategoryDto),
  catchAsync(CategoryController.updateCategory)
);
router.delete(
  '/:id',
  validationHandler(deleteCategoryDto),
  catchAsync(CategoryController.deleteCategory)
);

export default router;
