import type { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export default (fn: AsyncHandler): RequestHandler =>
  (req, res, next) =>
    fn(req, res, next).catch((error: unknown) => {
      next(error);
    });
