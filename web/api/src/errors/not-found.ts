import { StatusCodes } from 'http-status-codes';
import { CustomApiError } from './custom-error.js';

export class NotFound extends CustomApiError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND);
  }
}
