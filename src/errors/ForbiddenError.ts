import { ErrorCodes, ErrorMessages, HttpStatus } from '../constants/index.ts';
import BaseError from './BaseError.ts';

class ForbiddenError extends BaseError {
  constructor(message: string = ErrorMessages.Forbidden) {
    super(message, ErrorCodes.Forbidden, HttpStatus.Forbidden);
  }
}

export default ForbiddenError;
