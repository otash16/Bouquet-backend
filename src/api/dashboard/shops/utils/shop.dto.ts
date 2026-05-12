import { z } from 'zod/v4';
import commonValidator from '../../../shared/utils/commonValidator.ts';

const translationSchema = z.object({
  language: z.enum(['uz', 'ru', 'en']),
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(1000).optional().nullable(),
});

export const createShopDto = z.object({
  body: z.object({
    slug: z.string().min(1).max(100),
    logo: z.string().max(255).optional().nullable(),
    coverImage: z.string().max(255).optional().nullable(),
    phone: z.string().max(20).optional().nullable(),
    address: z.string().max(255).optional().nullable(),
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
    status: z
      .number()
      .refine(v => v === 1 || v === -1)
      .default(1),
    translations: z.array(translationSchema).min(1, 'At least one translation is required'),
  }),
});

export const updateShopDto = z.object({
  body: z.object({
    slug: z.string().min(1).max(100).optional(),
    logo: z.string().max(255).optional().nullable(),
    coverImage: z.string().max(255).optional().nullable(),
    phone: z.string().max(20).optional().nullable(),
    address: z.string().max(255).optional().nullable(),
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
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

export const getShopsDto = z.object({
  query: z.object({
    ...commonValidator.paginationValidator(),
    ...commonValidator.sortValidator(['createdAt', 'slug']),
    search: z.string().optional(),
    status: z.coerce.number().optional(),
  }),
});

export const getShopByIdDto = z.object({
  params: z.object({
    ...commonValidator.paramsValidator('id'),
  }),
});

export const deleteShopDto = z.object({
  params: z.object({
    ...commonValidator.paramsValidator('id'),
  }),
});

export type TCreateShopDto = z.infer<typeof createShopDto>;
export type TUpdateShopDto = z.infer<typeof updateShopDto>;
export type TGetShopsDto = z.infer<typeof getShopsDto>;
export type TGetShopByIdDto = z.infer<typeof getShopByIdDto>;
export type TDeleteShopDto = z.infer<typeof deleteShopDto>;
