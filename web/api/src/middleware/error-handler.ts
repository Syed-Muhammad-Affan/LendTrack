import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

interface CustomError {
  msg: string;
  statusCode: number;
}

export class ErrorHandler {
  handle = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const customError: CustomError = {
      statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      msg: err.message || 'Something went wrong',
    };

    if (err.name === 'ValidationError') {
      customError.msg = Object.values(err.errors)
        .map((item: any) => item.message)
        .join(', ');

      customError.statusCode = StatusCodes.BAD_REQUEST;
    }

    if (err.code === 11000) {
      customError.msg = `Duplicate value entered for ${Object.keys(
        err.keyValue,
      )} field, please choose another value`;

      customError.statusCode = StatusCodes.BAD_REQUEST;
    }

    if (err.name === 'CastError') {
      customError.msg = `No item found with id: ${err.value}`;

      customError.statusCode = StatusCodes.NOT_FOUND;
    }

    res.status(customError.statusCode).json({
      msg: customError.msg,
    });
  };
}
