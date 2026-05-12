import { z } from 'zod/v4';
import { AdminRole } from '../../../../enums/index.ts';
import commonValidator, { passwordSchema } from '../../../shared/utils/commonValidator.ts';

export const signinDto = z.object({
  body: z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const createAdminDto = z.object({
  body: z.object({
    fullName: z.string().min(2).max(100),
    username: z.string().min(3).max(50),
    phoneNumber: z.string().min(5).max(20),
    password: passwordSchema,
    role: z.nativeEnum(AdminRole).default(AdminRole.ShopAdmin),
    shopId: z.uuid().optional().nullable(),
    status: z
      .number()
      .refine(v => v === 1 || v === -1)
      .default(1),
  }),
});

export const updateAdminDto = z.object({
  body: z.object({
    fullName: z.string().min(2).max(100).optional(),
    username: z.string().min(3).max(50).optional(),
    phoneNumber: z.string().min(5).max(20).optional(),
    password: z.string().min(6).optional(),
    role: z.nativeEnum(AdminRole).optional(),
    shopId: z.uuid().optional().nullable(),
    status: z
      .number()
      .refine(v => v === 1 || v === -1 || v === -2)
      .optional(),
  }),
  params: z.object({
    ...commonValidator.paramsValidator('id'),
  }),
});

export const getAdminsDto = z.object({
  query: z.object({
    ...commonValidator.paginationValidator(),
    ...commonValidator.sortValidator(['createdAt', 'fullName', 'username']),
    search: z.string().optional(),
    shopId: z.uuid().optional(),
  }),
});

export const getAdminByIdDto = z.object({
  params: z.object({
    ...commonValidator.paramsValidator('id'),
  }),
});

export const deleteAdminDto = z.object({
  params: z.object({
    ...commonValidator.paramsValidator('id'),
  }),
});

export const changePasswordDto = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
  }),
});

export type TChangePasswordDto = z.infer<typeof changePasswordDto>;
export type TSigninDto = z.infer<typeof signinDto>;
export type TCreateAdminDto = z.infer<typeof createAdminDto>;
export type TUpdateAdminDto = z.infer<typeof updateAdminDto>;
export type TGetAdminsDto = z.infer<typeof getAdminsDto>;
export type TGetAdminByIdDto = z.infer<typeof getAdminByIdDto>;
export type TDeleteAdminDto = z.infer<typeof deleteAdminDto>;
