import { db } from '../../../config/index.ts';
import { AdminSessionStatus, AdminStatus } from '../../../enums/index.ts';
import { UnauthorizedError } from '../../../errors/index.ts';
import { JwtService } from '../../../services/index.ts';
import { comparePasswords } from '../../../utilities/index.ts';

// Dummy hash — timing attack oldini olish uchun
const DUMMY_HASH = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4VLHK.7u0f3OqqfG';

interface ISigninData {
  username: string;
  password: string;
  userAgent?: string;
  ip?: string;
}

export const signin = async (data: ISigninData) => {
  const { username, password, ip, userAgent } = data;

  const admin = await db.admin.findFirst({
    where: {
      username,
      status: AdminStatus.Active,
      deletedAt: null,
    },
  });

  console.log('signin: admin found:', admin?.id, 'username:', username);

  // Timing attack oldini olish uchun har doim parolni solishtirish
  const hashToCompare = admin?.passwordHash ?? DUMMY_HASH;
  const isPasswordValid = await comparePasswords(password, hashToCompare);

  console.log('signin: password valid:', isPasswordValid);

  if (!admin || !isPasswordValid) {
    throw new UnauthorizedError();
  }

  const session = await db.adminSession.create({
    data: {
      adminId: admin.id,
      ipAddress: ip || '',
      userAgent: userAgent || '',
      status: AdminSessionStatus.Active,
    },
  });

  const tokens = JwtService.generateTokens({ sub: session.id });

  await db.adminSession.update({
    where: { id: session.id },
    data: { token: tokens.refresh.token },
  });

  return tokens;
};

export const logout = async (sessionId: string) => {
  await db.adminSession.update({
    where: { id: sessionId },
    data: { status: AdminSessionStatus.Logout },
  });
};

export const refreshTokens = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new UnauthorizedError();
  }

  const decodedData = JwtService.verifyRefresh(refreshToken);

  const session = await db.adminSession.findFirst({
    where: {
      id: decodedData.sub,
      token: refreshToken,
      status: AdminSessionStatus.Active,
      deletedAt: null,
    },
  });

  if (!session) {
    throw new UnauthorizedError();
  }

  const tokens = JwtService.generateTokens({ sub: session.id });

  await db.adminSession.update({
    where: { id: session.id },
    data: { token: tokens.refresh.token },
  });

  return tokens;
};
