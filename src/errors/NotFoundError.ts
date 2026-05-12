import { ErrorCodes, ErrorMessages, HttpStatus } from '../constants/index.ts';
import BaseError from './BaseError.ts';

class NotFoundError extends BaseError {
  constructor(
    message: string = ErrorMessages.NotFound,
    code: string = ErrorCodes.NotFound,
    errorData: object | null = null
  ) {
    super(message, code, HttpStatus.NotFound, errorData);
  }
}

export default NotFoundError;
