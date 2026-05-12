import type { NextFunction, Request, Response } from 'express';
import { db } from '../../../config/index.ts';
import { AdminSessionStatus, AdminStatus } from '../../../enums/index.ts';
import { UnauthorizedError } from '../../../errors/index.ts';
import { JwtService } from '../../../services/index.ts';

const SESSION_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 soat

export default async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnauthorizedError();
    }

    const token = authorization.split(' ')[1];

    if (!authorization.startsWith('Bearer') || !token) {
      throw new UnauthorizedError();
    }

    const decodedData = JwtService.verifyAccess(token);

    if (!decodedData) {
      throw new UnauthorizedError();
    }

    const session = await db.adminSession.findUnique({
      where: {
        id: decodedData.sub,
        status: AdminSessionStatus.Active,
        admin: { status: AdminStatus.Active, deletedAt: null },
        deletedAt: null,
      },
      select: {
        id: true,
        lastActiveAt: true,
        admin: { select: { id: true, fullName: true, role: true, shopId: true } },
      },
    });

    if (!session) {
      throw new UnauthorizedError();
    }

    // Session timeout tekshirish
    const now = Date.now();
    const lastActive = session.lastActiveAt.getTime();
    if (now - lastActive > SESSION_TIMEOUT_MS) {
      await db.adminSession.update({
        where: { id: session.id },
        data: { status: AdminSessionStatus.Inactive },
      });
      throw new UnauthorizedError('Session expired');
    }

    // Last active vaqtini yangilash
    await db.adminSession.update({
      where: { id: session.id },
      data: { lastActiveAt: new Date() },
    });

    req.admin = {
      sessionId: session.id,
      adminId: session.admin.id,
      adminName: session.admin.fullName,
      role: session.admin.role,
      shopId: session.admin.shopId,
    };

    next();
  } catch (error) {
    next(error);
  }
};
