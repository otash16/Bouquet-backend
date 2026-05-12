import type { Request, Response } from 'express';
import { HttpStatus } from '../../../constants/index.ts';
import * as FlowerService from './flower.service.ts';
import type {
  TCreateFlowerDto,
  TDeleteFlowerDto,
  TGetFlowerByIdDto,
  TGetFlowersDto,
  TUpdateFlowerDto,
} from './utils/flower.dto.ts';

export const getFlowers = async (req: Request, res: Response) => {
  const response = await FlowerService.getFlowers(req.validated.query as TGetFlowersDto['query'], {
    role: req.admin!.role,
    shopId: req.admin!.shopId,
  });
  res.success(HttpStatus.Ok, response);
};

export const getFlowerById = async (req: Request, res: Response) => {
  const response = await FlowerService.getFlowerById(
    req.validated.params.id as TGetFlowerByIdDto['params']['id'],
    { role: req.admin!.role, shopId: req.admin!.shopId }
  );
  res.success(HttpStatus.Ok, response);
};

export const createFlower = async (req: Request, res: Response) => {
  const response = await FlowerService.createFlower(
    req.validated.body as TCreateFlowerDto['body'],
    { role: req.admin!.role, shopId: req.admin!.shopId }
  );
  res.success(HttpStatus.Created, response);
};

export const updateFlower = async (req: Request, res: Response) => {
  const response = await FlowerService.updateFlower(
    req.validated.params.id as TUpdateFlowerDto['params']['id'],
    req.validated.body as TUpdateFlowerDto['body'],
    { role: req.admin!.role, shopId: req.admin!.shopId }
  );
  res.success(HttpStatus.Ok, response);
};

export const deleteFlower = async (req: Request, res: Response) => {
  await FlowerService.deleteFlower(req.validated.params.id as TDeleteFlowerDto['params']['id'], {
    role: req.admin!.role,
    shopId: req.admin!.shopId,
  });
  res.success(HttpStatus.Ok, { message: 'Flower deleted successfully' });
};
