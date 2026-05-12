import { ErrorCodes, ErrorMessages, HttpStatus } from '../constants/index.ts';
import BaseError from './BaseError.ts';

class ValidationError extends BaseError {
  constructor(errorData: object | null) {
    super(
      ErrorMessages.ValidationError,
      ErrorCodes.ValidationError,
      HttpStatus.BadRequest,
      errorData
    );
  }
}

export default ValidationError;
