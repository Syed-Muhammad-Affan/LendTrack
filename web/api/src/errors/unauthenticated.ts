import { StatusCodes } from 'http-status-codes';
import { CustomApiError } from './custom-error.js';

export class Unauthenticated extends CustomApiError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}
