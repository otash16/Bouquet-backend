import { ErrorCodes, ErrorMessages, HttpStatus } from '../constants/index.ts';
import BaseError from './BaseError.ts';

class BadRequestError extends BaseError {
  constructor(
    errorMessage: string = ErrorMessages.BadRequest,
    errorCode: string = ErrorCodes.BadRequest,
    errorData: object = {}
  ) {
    super(errorMessage, errorCode, HttpStatus.BadRequest, errorData);
  }
}

export default BadRequestError;
