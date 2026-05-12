import type { Request, Response } from 'express';
import { HttpStatus } from '../../../constants/index.ts';
import * as CategoryService from './category.service.ts';
import type {
  TCreateCategoryDto,
  TDeleteCategoryDto,
  TGetCategoriesDto,
  TGetCategoryByIdDto,
  TUpdateCategoryDto,
} from './utils/category.dto.ts';

export const getCategories = async (req: Request, res: Response) => {
  const response = await CategoryService.getCategories(
    req.validated.query as TGetCategoriesDto['query']
  );
  res.success(HttpStatus.Ok, response);
};

export const getCategoryById = async (req: Request, res: Response) => {
  const response = await CategoryService.getCategoryById(
    req.validated.params.id as TGetCategoryByIdDto['params']['id']
  );
  res.success(HttpStatus.Ok, response);
};

export const createCategory = async (req: Request, res: Response) => {
  const response = await CategoryService.createCategory(
    req.validated.body as TCreateCategoryDto['body']
  );
  res.success(HttpStatus.Created, response);
};

export const updateCategory = async (req: Request, res: Response) => {
  const response = await CategoryService.updateCategory(
    req.validated.params.id as TUpdateCategoryDto['params']['id'],
    req.validated.body as TUpdateCategoryDto['body']
  );
  res.success(HttpStatus.Ok, response);
};

export const deleteCategory = async (req: Request, res: Response) => {
  await CategoryService.deleteCategory(
    req.validated.params.id as TDeleteCategoryDto['params']['id']
  );
  res.success(HttpStatus.Ok, { message: 'Category deleted successfully' });
};
