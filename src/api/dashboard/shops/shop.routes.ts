import { Router } from 'express';
import { validationHandler } from '../../../middlewares/index.ts';
import { catchAsync } from '../../../utilities/index.ts';
import superAdminGuard from '../../shared/middlewares/superAdminGuard.ts';
import * as ShopController from './shop.controller.ts';
import {
  createShopDto,
  deleteShopDto,
  getShopByIdDto,
  getShopsDto,
  updateShopDto,
} from './utils/shop.dto.ts';

const router = Router();

// Barcha adminlar ko'ra oladi (shop admin faqat o'zinikini)
router.get('/', validationHandler(getShopsDto), catchAsync(ShopController.getShops));
router.get('/:id', validationHandler(getShopByIdDto), catchAsync(ShopController.getShopById));

// Shop admin ham o'z do'konini o'zgartira oladi
router.patch('/:id', validationHandler(updateShopDto), catchAsync(ShopController.updateShop));

// Faqat superadmin yaratishi/o'chirishi mumkin
router.post(
  '/',
  superAdminGuard,
  validationHandler(createShopDto),
  catchAsync(ShopController.createShop)
);
router.delete(
  '/:id',
  superAdminGuard,
  validationHandler(deleteShopDto),
  catchAsync(ShopController.deleteShop)
);

export default router;
