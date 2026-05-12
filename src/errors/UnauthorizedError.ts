import { ErrorCodes, ErrorMessages, HttpStatus } from '../constants/index.ts';
import BaseError from './BaseError.ts';

class UnauthorizedError extends BaseError {
  constructor(message: string = ErrorMessages.Unauthorized) {
    super(message, ErrorCodes.Unauthorized, HttpStatus.Unauthorized);
  }
}

export default UnauthorizedError;
