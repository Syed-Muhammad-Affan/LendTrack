import { StatusCodes } from 'http-status-codes';
import { CustomApiError } from './custom-error.js';

export class BadRequest extends CustomApiError {
  constructor(message: string, details?: unknown) {
    super(message, StatusCodes.BAD_REQUEST, details);
  }
}
