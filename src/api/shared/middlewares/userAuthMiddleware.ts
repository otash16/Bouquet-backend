import { createHmac } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { db, env } from '../../../config/index.ts';
import { UnauthorizedError } from '../../../errors/index.ts';
import { JwtService } from '../../../services/index.ts';

interface TelegramUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  language_code?: string;
}

const validateInitData = (initData: string, botToken: string): boolean => {
  try {
    const data = new URLSearchParams(initData);
    const telegramHash = data.get('hash');
    if (!telegramHash) return false;

    const checkString = [...data.entries()]
      .filter(([key]) => key !== 'hash')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest();
    const calculatedHash = createHmac('sha256', secretKey).update(checkString).digest('hex');

    return calculatedHash === telegramHash;
  } catch {
    return false;
  }
};

// Development uchun mock user
const parseMockUser = (): TelegramUser => ({
  id: 123456789,
  username: 'dev_user',
  first_name: 'Dev',
  last_name: 'User',
  language_code: 'uz',
});

export default async (req: Request, _res: Response, next: NextFunction) => {
  try {
    // ── JWT token orqali auth ──────────────────────────────────────
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      try {
        const payload = JwtService.verifyAccess(token);
        const user = await db.user.findUnique({
          where: { id: payload.sub },
          select: { id: true, language: true },
        });
        if (user) {
          req.user = { id: user.id, language: user.language };
          return next();
        }
      } catch {
        throw new UnauthorizedError('Invalid or expired token');
      }
    }

    // ── Telegram initData orqali auth ──────────────────────────────
    const initData =
      (req.headers['x-telegram-init-data'] as string) ||
      ((req.body as Record<string, unknown>)?.initData as string);

    const isDev = process.env.NODE_ENV !== 'production';

    if (!initData) {
      if (isDev) {
        const telegramUser = parseMockUser();

        let user = await db.user.findUnique({
          where: { tgId: String(telegramUser.id) },
        });

        if (!user) {
          user = await db.user.create({
            data: {
              tgId: String(telegramUser.id),
              username: telegramUser.username ?? null,
              firstName: telegramUser.first_name ?? null,
              lastName: telegramUser.last_name ?? null,
              language: 'uz',
            },
          });
        }

        req.user = { id: user.id, language: user.language };
        db.userVisit.create({ data: { userId: user.id, userAgent: req.get('user-agent') ?? null } }).catch(() => {});
        return next();
      }

      throw new UnauthorizedError('Unauthorized');
    }

    // ── initData validatsiya ───────────────────────────────────────
    if (!isDev && !validateInitData(initData, env.TG_BOT_TOKEN)) {
      throw new UnauthorizedError('Invalid Telegram data');
    }

    // ── User topish yoki yaratish ──────────────────────────────────
    const data = new URLSearchParams(initData);
    const userRaw = data.get('user');
    if (!userRaw) throw new UnauthorizedError('Telegram user missing');

    const telegramUser = JSON.parse(userRaw) as TelegramUser;

    let user = await db.user.findUnique({
      where: { tgId: String(telegramUser.id) },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          tgId: String(telegramUser.id),
          username: telegramUser.username ?? null,
          firstName: telegramUser.first_name ?? null,
          lastName: telegramUser.last_name ?? null,
          language: telegramUser.language_code ?? 'uz',
        },
      });
    }

    req.user = { id: user.id, language: user.language };

    // Visit yozish (async, kutmaymiz)
    db.userVisit.create({
      data: {
        userId: user.id,
        userAgent: req.get('user-agent') ?? null,
      },
    }).catch(() => {});

    next();
  } catch (error) {
    next(error);
  }
};
