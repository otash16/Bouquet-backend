import type { Request, Response } from 'express';
import { env } from '../../../config/index.ts';
import { Environment, HttpStatus } from '../../../constants/index.ts';
import { UnauthorizedError } from '../../../errors/index.ts';
import * as AdminAuthService from '../../shared/services/adminAuth.service.ts';
import type { TSigninDto } from './utils/admin.dto.ts';

export const signin = async (req: Request, res: Response) => {
  const { username, password } = req.validated.body as TSigninDto['body'];

  const { refresh, access } = await AdminAuthService.signin({
    username,
    password,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  res.cookie('refresh_token', refresh.token, {
    sameSite: env.NODE_ENV === Environment.Test ? 'none' : false,
    secure: true,
    httpOnly: true,
    expires: refresh.expiresAt,
  });

  res.success(HttpStatus.Ok, access);
};

export const logout = async (req: Request, res: Response) => {
  await AdminAuthService.logout(req.admin!.sessionId);

  res.clearCookie('refresh_token');
  res.success(HttpStatus.Ok, { message: 'Logged out successfully' });
};

export const refresh = async (req: Request, res: Response) => {
  const { refresh_token: refreshToken } = req.cookies;

  const { access, refresh } = await AdminAuthService.refreshTokens(refreshToken as string);

  res.cookie('refresh_token', refresh.token, {
    sameSite: env.NODE_ENV === Environment.Test ? 'none' : false,
    secure: true,
    httpOnly: true,
    expires: refresh.expiresAt,
  });

  res.success(HttpStatus.Ok, access);
};

export const info = async (req: Request, res: Response) => {
  if (!req.admin) {
    throw new UnauthorizedError();
  }

  const admin = await (await import('../../../config/index.ts')).db.admin.findUnique({
    where: { id: req.admin.adminId, deletedAt: null },
    select: {
      id: true,
      fullName: true,
      phoneNumber: true,
      username: true,
      role: true,
      status: true,
      shopId: true,
      shop: {
        select: {
          translations: {
            where: { language: 'uz' },
            select: { name: true },
          },
        },
      },
      createdAt: true,
    },
  });

  if (!admin) {
    throw new UnauthorizedError();
  }

  res.success(HttpStatus.Ok, {
    id: admin.id,
    fullName: admin.fullName,
    phoneNumber: admin.phoneNumber,
    username: admin.username,
    role: admin.role,
    status: admin.status,
    shopId: admin.shopId,
    shopName: admin.shop?.translations[0]?.name ?? null,
    createdAt: admin.createdAt,
  });
};
