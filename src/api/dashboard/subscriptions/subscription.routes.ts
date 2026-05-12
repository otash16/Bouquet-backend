import { Router } from 'express';
import { validationHandler } from '../../../middlewares/index.ts';
import { catchAsync } from '../../../utilities/index.ts';
import superAdminGuard from '../../shared/middlewares/superAdminGuard.ts';
import * as SubscriptionController from './subscription.controller.ts';
import {
  cancelSubscriptionDto,
  createSubscriptionDto,
  getSubscriptionByIdDto,
  getSubscriptionsDto,
} from './utils/subscription.dto.ts';

const router = Router();

// Barcha adminlar ko'ra oladi
router.get(
  '/',
  validationHandler(getSubscriptionsDto),
  catchAsync(SubscriptionController.getSubscriptions)
);
router.get(
  '/:id',
  validationHandler(getSubscriptionByIdDto),
  catchAsync(SubscriptionController.getSubscriptionById)
);

// Faqat superadmin
router.use(superAdminGuard);
router.post(
  '/',
  validationHandler(createSubscriptionDto),
  catchAsync(SubscriptionController.createSubscription)
);
router.patch(
  '/:id/cancel',
  validationHandler(cancelSubscriptionDto),
  catchAsync(SubscriptionController.cancelSubscription)
);

export default router;
