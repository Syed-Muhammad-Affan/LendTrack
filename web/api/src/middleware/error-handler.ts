import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomApiError } from '../errors/custom-error.js';

interface FormattedError {
  statusCode: number;
  code: string;
  message: string;
  fields?: Record<string, string>;
}

const statusCodeToErrorCode: Record<number, string> = {
  [StatusCodes.BAD_REQUEST]: 'VALIDATION_ERROR',
  [StatusCodes.UNAUTHORIZED]: 'UNAUTHENTICATED',
  [StatusCodes.FORBIDDEN]: 'FORBIDDEN',
  [StatusCodes.NOT_FOUND]: 'NOT_FOUND',
};

export class ErrorHandler {
  handle = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const formatted: FormattedError = {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong',
    };

    // Your own thrown errors (BadRequest, NotFound, Unauthenticated, Forbidden)
    if (err instanceof CustomApiError) {
      formatted.statusCode = err.statusCode;
      formatted.message = err.message;
      formatted.code = statusCodeToErrorCode[err.statusCode] || 'ERROR';

      const flattenedFields = flattenZodDetails(err.details);
      if (flattenedFields) {
        formatted.fields = flattenedFields;
      }
    }
    // Mongoose schema validation errors
    else if (err.name === 'ValidationError' && err.errors) {
      formatted.statusCode = StatusCodes.BAD_REQUEST;
      formatted.code = 'VALIDATION_ERROR';
      formatted.message = Object.values(err.errors)
        .map((item: any) => item.message)
        .join(', ');
    }
    // Duplicate key
    else if (err.code === 11000) {
      formatted.statusCode = StatusCodes.BAD_REQUEST;
      formatted.code = 'DUPLICATE_VALUE';
      formatted.message = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
    }
    // Invalid ObjectId
    else if (err.name === 'CastError') {
      formatted.statusCode = StatusCodes.NOT_FOUND;
      formatted.code = 'NOT_FOUND';
      formatted.message = `No item found with id: ${err.value}`;
    }
    // Unknown/unexpected error — log it, don't leak internals to the client
    else {
      console.error(err);
    }

    res.status(formatted.statusCode).json({
      success: false,
      error: {
        code: formatted.code,
        message: formatted.message,
        ...(formatted.fields ? { fields: formatted.fields } : {}),
      },
    });
  };
}

function flattenZodDetails(
  details: unknown,
): Record<string, string> | undefined {
  const flat = details as { fieldErrors?: Record<string, string[]> };
  if (!flat?.fieldErrors) return undefined;

  const entries = Object.entries(flat.fieldErrors)
    .filter(([, messages]) => messages.length > 0)
    .map(([field, messages]) => [field, messages[0] as string] as const);

  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}
