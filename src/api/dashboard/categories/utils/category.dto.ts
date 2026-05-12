import { z } from 'zod/v4';
import commonValidator from '../../../shared/utils/commonValidator.ts';

const translationSchema = z.object({
  language: z.enum(['uz', 'ru', 'en']),
  name: z.string().min(1, 'Name is required').max(100),
});

export const createCategoryDto = z.object({
  body: z.object({
    slug: z.string().min(1).max(100),
    image: z.string().max(255).optional(),
    status: z
      .number()
      .refine(v => v === 1 || v === -1)
      .default(1),
    translations: z.array(translationSchema).min(1, 'At least one translation is required'),
  }),
});

export const updateCategoryDto = z.object({
  body: z.object({
    slug: z.string().min(1).max(100).optional(),
    image: z.string().max(255).optional().nullable(),
    status: z
      .number()
      .refine(v => v === 1 || v === -1)
      .optional(),
    translations: z.array(translationSchema).optional(),
  }),
  params: z.object({
    ...commonValidator.paramsValidator('id'),
  }),
});

export const getCategoriesDto = z.object({
  query: z.object({
    ...commonValidator.paginationValidator(),
    ...commonValidator.sortValidator(['createdAt', 'slug']),
    search: z.string().optional(),
  }),
});

export const getCategoryByIdDto = z.object({
  params: z.object({
    ...commonValidator.paramsValidator('id'),
  }),
});

export const deleteCategoryDto = z.object({
  params: z.object({
    ...commonValidator.paramsValidator('id'),
  }),
});

export type TCreateCategoryDto = z.infer<typeof createCategoryDto>;
export type TUpdateCategoryDto = z.infer<typeof updateCategoryDto>;
export type TGetCategoriesDto = z.infer<typeof getCategoriesDto>;
export type TGetCategoryByIdDto = z.infer<typeof getCategoryByIdDto>;
export type TDeleteCategoryDto = z.infer<typeof deleteCategoryDto>;
