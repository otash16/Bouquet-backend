import { Router } from 'express';
import { catchAsync } from '../../../utilities/index.ts';
import * as ShopController from './shop.controller.ts';

const router = Router();

router.get('/', catchAsync(ShopController.getShops));
router.get('/:slug', catchAsync(ShopController.getShopBySlug));

export default router;
