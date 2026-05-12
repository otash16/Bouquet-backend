import { Router } from 'express';
import { uploadFlowerPhoto, uploadShopPhoto } from '../../../middlewares/upload.middleware.ts';
import { catchAsync } from '../../../utilities/index.ts';
import * as UploadController from './upload.controller.ts';

const router = Router();

// Shop rasm yuklash (logo, cover)
router.post('/shop', uploadShopPhoto.single('file'), catchAsync(UploadController.uploadShopImage));

// Gul rasm yuklash (bitta)
router.post(
  '/flower',
  uploadFlowerPhoto.single('file'),
  catchAsync(UploadController.uploadFlowerImage)
);

// Gul rasmlar yuklash (ko'p)
router.post(
  '/flowers',
  uploadFlowerPhoto.array('files', 10),
  catchAsync(UploadController.uploadFlowerImages)
);

export default router;
