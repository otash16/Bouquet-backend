import type { Request, Response } from 'express';
import { HttpStatus } from '../../../constants/index.ts';
import * as StatsService from './stats.service.ts';

export const getDashboardStats = async (_req: Request, res: Response) => {
  const response = await StatsService.getDashboardStats();
  res.success(HttpStatus.Ok, response);
};
