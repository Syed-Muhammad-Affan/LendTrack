import { BadRequest } from './bad-request.js';
import { CustomApiError } from './custom-error.js';
import { Forbidden } from './forbidden.error.js';
import { NotFound } from './not-found.js';
import { Unauthenticated } from './unauthenticated.js';

export default {
  CustomApiError,
  NotFound,
  BadRequest,
  Unauthenticated,
  Forbidden,
};
