import type { Request, Response } from 'express';
import { HttpStatus } from '../../../constants/index.ts';
import * as ShopService from './shop.service.ts';
import type {
  TCreateShopDto,
  TDeleteShopDto,
  TGetShopByIdDto,
  TGetShopsDto,
  TUpdateShopDto,
} from './utils/shop.dto.ts';

export const getShops = async (req: Request, res: Response) => {
  const response = await ShopService.getShops(req.validated.query as TGetShopsDto['query'], {
    role: req.admin!.role,
    shopId: req.admin!.shopId,
  });
  res.success(HttpStatus.Ok, response);
};

export const getShopById = async (req: Request, res: Response) => {
  const response = await ShopService.getShopById(
    req.validated.params.id as TGetShopByIdDto['params']['id'],
    { role: req.admin!.role, shopId: req.admin!.shopId }
  );
  res.success(HttpStatus.Ok, response);
};

export const createShop = async (req: Request, res: Response) => {
  const response = await ShopService.createShop(req.validated.body as TCreateShopDto['body']);
  res.success(HttpStatus.Created, response);
};

export const updateShop = async (req: Request, res: Response) => {
  const response = await ShopService.updateShop(
    req.validated.params.id as TUpdateShopDto['params']['id'],
    req.validated.body as TUpdateShopDto['body'],
    { role: req.admin!.role, shopId: req.admin!.shopId }
  );
  res.success(HttpStatus.Ok, response);
};

export const deleteShop = async (req: Request, res: Response) => {
  await ShopService.deleteShop(req.validated.params.id as TDeleteShopDto['params']['id']);
  res.success(HttpStatus.Ok, { message: 'Shop deleted successfully' });
};
