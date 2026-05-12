import type { Request, Response } from 'express';
import { HttpStatus } from '../../../constants/index.ts';
import * as FlowerService from './flower.service.ts';

export const getFlowers = async (req: Request, res: Response) => {
  const response = await FlowerService.getFlowers({
    language: (req.query.lang as string) || 'uz',
    shopId: req.query.shopId as string | undefined,
    categoryId: req.query.categoryId as string | undefined,
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  });
  res.success(HttpStatus.Ok, response);
};

export const getFlowerById = async (req: Request, res: Response) => {
  const language = (req.query.lang as string) || 'uz';
  const response = await FlowerService.getFlowerById(req.params.id as string, language);
  res.success(HttpStatus.Ok, response);
};
