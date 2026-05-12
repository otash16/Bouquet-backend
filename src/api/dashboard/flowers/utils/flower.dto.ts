import { z } from 'zod/v4';
import commonValidator from '../../../shared/utils/commonValidator.ts';

const translationSchema = z.object({
  language: z.enum(['uz', 'ru', 'en']),
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(2000).optional().nullable(),
});

export const createFlowerDto = z.object({
  body: z.object({
    shopId: z.uuid(),
    categoryId: z.uuid().optional().nullable(),
    price: z.number().positive(),
    discountPrice: z.number().positive().optional().nullable(),
    images: z.array(z.string().max(255)).default([]),
    status: z
      .number()
      .refine(v => v === 1 || v === -1)
      .default(1),
    translations: z.array(translationSchema).min(1, 'At least one translation is required'),
  }),
});

export const updateFlowerDto = z.object({
  body: z.object({
    categoryId: z.uuid().optional().nullable(),
    price: z.number().positive().optional(),
    discountPrice: z.number().positive().optional().nullable(),
    images: z.array(z.string().max(255)).optional(),
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

export const getFlowersDto = z.object({
  query: z.object({
    ...commonValidator.paginationValidator(),
    ...commonValidator.sortValidator(['createdAt', 'price']),
    search: z.string().optional(),
    shopId: z.uuid().optional(),
    categoryId: z.uuid().optional(),
    status: z.coerce.number().optional(),
  }),
});

export const getFlowerByIdDto = z.object({
  params: z.object({
    ...commonValidator.paramsValidator('id'),
  }),
});

export const deleteFlowerDto = z.object({
  params: z.object({
    ...commonValidator.paramsValidator('id'),
  }),
});

export type TCreateFlowerDto = z.infer<typeof createFlowerDto>;
export type TUpdateFlowerDto = z.infer<typeof updateFlowerDto>;
export type TGetFlowersDto = z.infer<typeof getFlowersDto>;
export type TGetFlowerByIdDto = z.infer<typeof getFlowerByIdDto>;
export type TDeleteFlowerDto = z.infer<typeof deleteFlowerDto>;
