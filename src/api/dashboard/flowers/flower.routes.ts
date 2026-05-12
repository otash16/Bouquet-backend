import { Router } from 'express';
import { validationHandler } from '../../../middlewares/index.ts';
import { catchAsync } from '../../../utilities/index.ts';
import * as FlowerController from './flower.controller.ts';
import {
  createFlowerDto,
  deleteFlowerDto,
  getFlowerByIdDto,
  getFlowersDto,
  updateFlowerDto,
} from './utils/flower.dto.ts';

const router = Router();

router.get('/', validationHandler(getFlowersDto), catchAsync(FlowerController.getFlowers));
router.get('/:id', validationHandler(getFlowerByIdDto), catchAsync(FlowerController.getFlowerById));
router.post('/', validationHandler(createFlowerDto), catchAsync(FlowerController.createFlower));
router.patch('/:id', validationHandler(updateFlowerDto), catchAsync(FlowerController.updateFlower));
router.delete(
  '/:id',
  validationHandler(deleteFlowerDto),
  catchAsync(FlowerController.deleteFlower)
);

export default router;
