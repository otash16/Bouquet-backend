import type { NextFunction, Request, Response } from 'express';
import { ErrorCodes, ErrorMessages, HttpStatus } from '../constants/index.ts';

export default (request: Request, response: Response, _next: NextFunction) => {
  response.error(HttpStatus.NotFound, {
    code: ErrorCodes.NotFoundPath,
    message: ErrorMessages.NotFoundPath,
    data: { url: request.originalUrl },
  });
};
