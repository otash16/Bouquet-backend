import type { NextFunction, Request, Response } from 'express';
import type { z } from 'zod/v4';
import { ValidationError } from '../errors/index.ts';

interface ValidationInput {
  body: Record<string, unknown>;
  params: Record<string, unknown>;
  query: Record<string, unknown>;
}

export default <T extends z.ZodTypeAny>(schema: T) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
      }) as z.ZodSafeParseResult<ValidationInput>;

      if (!result.success) {
        next(new ValidationError(result.error.issues));
        return;
      }

      req.validated = {
        body: result.data.body ?? {},
        params: result.data.params ?? {},
        query: result.data.query ?? {},
      };

      next();
    } catch (error: unknown) {
      next(error);
    }
  };
