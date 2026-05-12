import type { Request, Response } from 'express';
import { HttpStatus } from '../../../constants/index.ts';
import * as ShopService from './shop.service.ts';

export const getShops = async (req: Request, res: Response) => {
  const language = (req.query.lang as string) || 'uz';
  const response = await ShopService.getShops(language);
  res.success(HttpStatus.Ok, response);
};

export const getShopBySlug = async (req: Request, res: Response) => {
  const language = (req.query.lang as string) || 'uz';
  const response = await ShopService.getShopBySlug(req.params.slug as string, language);
  res.success(HttpStatus.Ok, response);
};
