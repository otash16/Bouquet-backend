import type { Request, Response } from 'express';
import { HttpStatus } from '../../../constants/index.ts';
import { BadRequestError } from '../../../errors/index.ts';

export const uploadShopImage = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new BadRequestError('File is required');
  }

  const url = `/uploads/shops/${req.file.filename}`;
  res.success(HttpStatus.Ok, { url });
};

export const uploadFlowerImage = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new BadRequestError('File is required');
  }

  const url = `/uploads/flowers/${req.file.filename}`;
  res.success(HttpStatus.Ok, { url });
};

export const uploadFlowerImages = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw new BadRequestError('At least one file is required');
  }

  const urls = files.map(file => `/uploads/flowers/${file.filename}`);
  res.success(HttpStatus.Ok, { urls });
};
