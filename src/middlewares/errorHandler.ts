import type { NextFunction, Request, Response } from 'express';
import pkg from 'jsonwebtoken';
import { Prisma } from '../../generated/prisma/client.ts';
import { ErrorCodes, ErrorMessages, HttpStatus } from '../constants/index.ts';
import BaseError from '../errors/BaseError.ts';
import type { PayloadTooLargeError } from '../types/error.types.ts';
import { printError } from '../utilities/index.ts';

const { JsonWebTokenError } = pkg;

export default (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  // Base errors
  if (error instanceof BaseError) {
    printError(error, 'BaseError');
    return res.error(error.httpCode, {
      code: error.errorCode,
      message: error.errorMessage,
      data: error.errorData,
    });
  }

  // Payload too large
  if ((error as PayloadTooLargeError).type === 'entity.too.large') {
    return res.error(HttpStatus.BadRequest, {
      code: ErrorCodes.EntityTooLarge,
      message: error.message,
      data: { code: error.name, message: error.message },
    });
  }

  // JWT errors
  if (error instanceof JsonWebTokenError) {
    printError(error, 'JsonWebTokenError');
    return res.error(HttpStatus.Unauthorized, {
      code: ErrorCodes.JwtError,
      message: error.message,
    });
  }

  // Prisma errors
  if (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientValidationError
  ) {
    printError(error, 'PrismaError');

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const fields = (error.meta?.target as string[] | undefined) ?? [];
      const field = fields
        .map(f => f.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()))
        .join(', ');
      return res.error(HttpStatus.BadRequest, {
        code: ErrorCodes.BadRequest,
        message: field ? `${field} already exists` : 'Unique constraint violation',
      });
    }

    return res.error(HttpStatus.BadRequest, {
      code: ErrorCodes.PrismaError,
      message: ErrorMessages.PrismaError,
    });
  }

  // Unexpected errors
  printError(error, 'UnexpectedError');

  return res.error(HttpStatus.InternalServer, {
    code: ErrorCodes.InternalServerError,
    message: ErrorMessages.InternalServerError,
  });
};
