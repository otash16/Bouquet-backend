import { Router } from 'express';
import { catchAsync } from '../../../utilities/index.ts';
import * as CategoryController from './category.controller.ts';

const router = Router();

router.get('/', catchAsync(CategoryController.getCategories));

export default router;
