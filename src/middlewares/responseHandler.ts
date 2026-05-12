import type { NextFunction, Request, Response } from 'express';
import type {
  IErrorResponse,
  IErrorResponseData,
  ISuccessResponse,
} from '../types/response.types.ts';

export default (req: Request, res: Response, next: NextFunction): void => {
  res.success = (status: number, data: unknown) => {
    const successResponse: ISuccessResponse = {
      success: true,
      data: data,
    };
    req.response = successResponse;
    res.status(status).json(successResponse);
  };

  res.error = (status: number, error: IErrorResponseData) => {
    const errorResponse: IErrorResponse = {
      success: false,
      error: {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'Something went wrong',
        data: error.data || null,
      },
    };
    req.response = errorResponse;
    res.status(status).json(errorResponse);
  };

  next();
};
