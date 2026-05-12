import * as z from 'zod/v4';
import { SortOrder } from '../../../constants/index.ts';

export type TParamsValidatorKey = 'id' | 'shopId';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export default {
  paramsValidator(key: TParamsValidatorKey) {
    return {
      [key]: z.uuid({ version: 'v4' }),
    };
  },
  paginationValidator() {
    return {
      page: z.coerce.number().default(1),
      limit: z.coerce.number().default(10),
    };
  },
  sortValidator(keys: string[]) {
    return {
      sortKey: z.enum(keys).default('createdAt'),
      sortOrder: z.enum(Object.values(SortOrder)).default(SortOrder.Desc),
    };
  },
  passwordValidator() {
    return passwordSchema;
  },
};
