import { z } from 'zod/v4';
import commonValidator from '../../../shared/utils/commonValidator.ts';

const translationSchema = z.object({
  language: z.enum(['uz', 'ru', 'en']),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
});

export const createTariffDto = z.object({
  body: z.object({
    price: z.number().int().min(0),
    durationDays: z.number().int().positive(),
    flowerLimit: z.number().int().min(0).default(0),
    status: z
      .number()
      .refine(v => v === 1 || v === -1)
      .default(1),
    translations: z.array(translationSchema).min(1, 'At least one translation is required'),
  }),
});

export const updateTariffDto = z.object({
  body: z.object({
    price: z.number().int().min(0).optional(),
    durationDays: z.number().int().positive().optional(),
    flowerLimit: z.number().int().min(0).optional(),
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

export const getTariffsDto = z.object({
  query: z.object({
    ...commonValidator.paginationValidator(),
    ...commonValidator.sortValidator(['createdAt', 'price', 'durationDays']),
  }),
});

export const getTariffByIdDto = z.object({
  params: z.object({
    ...commonValidator.paramsValidator('id'),
  }),
});

export const deleteTariffDto = z.object({
  params: z.object({
    ...commonValidator.paramsValidator('id'),
  }),
});

export type TCreateTariffDto = z.infer<typeof createTariffDto>;
export type TUpdateTariffDto = z.infer<typeof updateTariffDto>;
export type TGetTariffsDto = z.infer<typeof getTariffsDto>;
export type TGetTariffByIdDto = z.infer<typeof getTariffByIdDto>;
export type TDeleteTariffDto = z.infer<typeof deleteTariffDto>;
