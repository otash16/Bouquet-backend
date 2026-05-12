import { ErrorCodes, ErrorMessages, HttpStatus } from '../constants/index.ts';

class BaseError extends Error {
  errorMessage: string;
  errorCode: string;
  httpCode: number;
  errorData: object | null;

  constructor(
    errorMessage: string = ErrorMessages.InternalServerError,
    errorCode: string = ErrorCodes.InternalServerError,
    httpCode: number = HttpStatus.InternalServer,
    errorData: object | null = null
  ) {
    super(errorMessage);

    this.name = this.constructor.name;
    this.errorMessage = errorMessage;
    this.errorCode = errorCode;
    this.httpCode = httpCode;
    this.errorData = errorData;

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace(this, this.constructor);
  }
}

export default BaseError;
