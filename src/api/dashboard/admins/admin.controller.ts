import type { Request, Response } from 'express';
import { db, env } from '../../../config/index.ts';
import { Environment, HttpStatus } from '../../../constants/index.ts';
import { UnauthorizedError } from '../../../errors/index.ts';
import * as AdminAuthService from '../../shared/services/adminAuth.service.ts';
import * as AdminService from './admin.service.ts';
import type {
  TChangePasswordDto,
  TCreateAdminDto,
  TDeleteAdminDto,
  TGetAdminByIdDto,
  TGetAdminsDto,
  TSigninDto,
  TUpdateAdminDto,
} from './utils/admin.dto.ts';

// ===== AUTH =====

export const signin = async (req: Request, res: Response) => {
  console.log('SIGNIN CONTROLLER CALLED');
  console.log('validated:', JSON.stringify(req.validated));
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

  const admin = await db.admin.findUnique({
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

export const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.validated.body as TChangePasswordDto['body'];
  await AdminService.changePassword(req.admin!.adminId, currentPassword, newPassword);
  res.success(HttpStatus.Ok, { message: 'Password changed successfully' });
};

export const getSessions = async (req: Request, res: Response) => {
  const response = await AdminService.getSessions(req.admin!.adminId);
  res.success(HttpStatus.Ok, response);
};

// ===== CRUD =====

export const getAdmins = async (req: Request, res: Response) => {
  const response = await AdminService.getAdmins(
    req.validated.query as TGetAdminsDto['query'],
    req.admin!.adminId
  );
  res.success(HttpStatus.Ok, response);
};

export const getAdminById = async (req: Request, res: Response) => {
  const response = await AdminService.getAdminById(
    req.validated.params.id as TGetAdminByIdDto['params']['id']
  );
  res.success(HttpStatus.Ok, response);
};

export const createAdmin = async (req: Request, res: Response) => {
  const response = await AdminService.createAdmin(req.validated.body as TCreateAdminDto['body']);
  res.success(HttpStatus.Created, response);
};

export const updateAdmin = async (req: Request, res: Response) => {
  const response = await AdminService.updateAdmin(
    req.validated.params.id as TUpdateAdminDto['params']['id'],
    req.validated.body as TUpdateAdminDto['body'],
    req.admin!.adminId
  );
  res.success(HttpStatus.Ok, response);
};

export const deleteAdmin = async (req: Request, res: Response) => {
  await AdminService.deleteAdmin(
    req.validated.params.id as TDeleteAdminDto['params']['id'],
    req.admin!.adminId
  );
  res.success(HttpStatus.Ok, { message: 'Admin deleted successfully' });
};
