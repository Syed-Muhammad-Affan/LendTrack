import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomApiError } from '../errors/custom-error.js';

interface FormattedError {
  statusCode: number;
  code: string;
  message: string;
  fields?: Record<string, string>;
}

// Each mapper turns one kind of error into a response. To support a new
// error type, add a mapper to the list; ErrorHandler itself never changes.
export interface ErrorMapper {
  canHandle(err: any): boolean;
  map(err: any): FormattedError;
}

const statusCodeToErrorCode: Record<number, string> = {
  [StatusCodes.BAD_REQUEST]: 'VALIDATION_ERROR',
  [StatusCodes.UNAUTHORIZED]: 'UNAUTHENTICATED',
  [StatusCodes.FORBIDDEN]: 'FORBIDDEN',
  [StatusCodes.NOT_FOUND]: 'NOT_FOUND',
};

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

const customApiErrorMapper: ErrorMapper = {
  canHandle: (err) => err instanceof CustomApiError,
  map: (err: CustomApiError) => {
    const fields = flattenZodDetails(err.details);
    return {
      statusCode: err.statusCode,
      code: statusCodeToErrorCode[err.statusCode] || 'ERROR',
      message: err.message,
      ...(fields ? { fields } : {}),
    };
  },
};

const mongooseValidationMapper: ErrorMapper = {
  canHandle: (err) => err.name === 'ValidationError' && !!err.errors,
  map: (err) => ({
    statusCode: StatusCodes.BAD_REQUEST,
    code: 'VALIDATION_ERROR',
    message: Object.values(err.errors)
      .map((item: any) => item.message)
      .join(', '),
  }),
};

const duplicateKeyMapper: ErrorMapper = {
  canHandle: (err) => err.code === 11000,
  map: (err) => ({
    statusCode: StatusCodes.BAD_REQUEST,
    code: 'DUPLICATE_VALUE',
    message: `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`,
  }),
};

const castErrorMapper: ErrorMapper = {
  canHandle: (err) => err.name === 'CastError',
  map: (err) => ({
    statusCode: StatusCodes.NOT_FOUND,
    code: 'NOT_FOUND',
    message: `No item found with id: ${err.value}`,
  }),
};

export const defaultErrorMappers: ErrorMapper[] = [
  customApiErrorMapper,
  mongooseValidationMapper,
  duplicateKeyMapper,
  castErrorMapper,
];

export class ErrorHandler {
  constructor(private readonly mappers: ErrorMapper[] = defaultErrorMappers) {}

  handle = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const mapper = this.mappers.find((m) => m.canHandle(err));

    let formatted: FormattedError;
    if (mapper) {
      formatted = mapper.map(err);
    } else {
      // Unknown error: log it, don't leak internals to the client
      console.error(err);
      formatted = {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong',
      };
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
