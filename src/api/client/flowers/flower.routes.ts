import { Router } from 'express';
import { catchAsync } from '../../../utilities/index.ts';
import * as FlowerController from './flower.controller.ts';

const router = Router();

router.get('/', catchAsync(FlowerController.getFlowers));
router.get('/:id', catchAsync(FlowerController.getFlowerById));

export default router;
