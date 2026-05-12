import type { NextFunction, Request, Response } from 'express';
import { AdminRole } from '../../../enums/index.ts';
import { ForbiddenError } from '../../../errors/index.ts';

export default (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.admin || req.admin.role !== AdminRole.SuperAdmin) {
    next(new ForbiddenError('Only superadmin can access this resource'));
    return;
  }

  next();
};
