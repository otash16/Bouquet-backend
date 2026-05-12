import type { Request, Response } from 'express';
import { HttpStatus } from '../../../constants/index.ts';
import { UnauthorizedError } from '../../../errors/index.ts';
import { JwtService } from '../../../services/index.ts';

export const telegramAuth = async (req: Request, res: Response) => {
  if (!req.user?.id) throw new UnauthorizedError();

  const tokens = JwtService.generateTokens({ sub: req.user.id });

  res.success(HttpStatus.Ok, tokens);
};
