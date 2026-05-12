import { z } from 'zod/v4';
import commonValidator from '../../../shared/utils/commonValidator.ts';

export const createSubscriptionDto = z.object({
  body: z.object({
    shopId: z.uuid(),
    tariffId: z.uuid(),
  }),
});

export const getSubscriptionsDto = z.object({
  query: z.object({
    ...commonValidator.paginationValidator(),
    ...commonValidator.sortValidator(['createdAt', 'endDate']),
    shopId: z.uuid().optional(),
    status: z.coerce.number().optional(),
  }),
});

export const getSubscriptionByIdDto = z.object({
  params: z.object({
    ...commonValidator.paramsValidator('id'),
  }),
});

export const cancelSubscriptionDto = z.object({
  params: z.object({
    ...commonValidator.paramsValidator('id'),
  }),
});

export type TCreateSubscriptionDto = z.infer<typeof createSubscriptionDto>;
export type TGetSubscriptionsDto = z.infer<typeof getSubscriptionsDto>;
export type TGetSubscriptionByIdDto = z.infer<typeof getSubscriptionByIdDto>;
export type TCancelSubscriptionDto = z.infer<typeof cancelSubscriptionDto>;
