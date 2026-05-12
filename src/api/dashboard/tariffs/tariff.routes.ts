import { Router } from 'express';
import { validationHandler } from '../../../middlewares/index.ts';
import { catchAsync } from '../../../utilities/index.ts';
import superAdminGuard from '../../shared/middlewares/superAdminGuard.ts';
import * as TariffController from './tariff.controller.ts';
import {
  createTariffDto,
  deleteTariffDto,
  getTariffByIdDto,
  getTariffsDto,
  updateTariffDto,
} from './utils/tariff.dto.ts';

const router = Router();

// Barcha adminlar ko'ra oladi
router.get('/', validationHandler(getTariffsDto), catchAsync(TariffController.getTariffs));
router.get('/:id', validationHandler(getTariffByIdDto), catchAsync(TariffController.getTariffById));

// Faqat superadmin
router.use(superAdminGuard);
router.post('/', validationHandler(createTariffDto), catchAsync(TariffController.createTariff));
router.patch('/:id', validationHandler(updateTariffDto), catchAsync(TariffController.updateTariff));
router.delete(
  '/:id',
  validationHandler(deleteTariffDto),
  catchAsync(TariffController.deleteTariff)
);

export default router;
