import type { Request, Response } from 'express';
import { HttpStatus } from '../../../constants/index.ts';
import * as CategoryService from './category.service.ts';

export const getCategories = async (req: Request, res: Response) => {
  const language = (req.query.lang as string) || 'uz';
  const response = await CategoryService.getCategories(language);
  res.success(HttpStatus.Ok, response);
};
