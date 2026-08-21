import { NextFunction, Request, Response } from 'express';
import z from 'zod';
import errors from '../errors/index.js';

export const validate = (schemas: {
  body?: z.ZodType;
  params?: z.ZodType;
  query?: z.ZodType;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (schemas.body) {
      const bodyResult = schemas.body.safeParse(req.body);

      if (!bodyResult.success) {
        return next(
          new errors.BadRequest(
            'Validation failed',
            bodyResult.error.flatten(),
          ),
        );
      }

      req.body = bodyResult.data;
    }

    if (schemas.params) {
      const paramsResult = schemas.params.safeParse(req.params);

      if (!paramsResult.success) {
        return next(
          new errors.BadRequest(
            'Invalid parameters',
            paramsResult.error.flatten(),
          ),
        );
      }

      req.params = paramsResult.data as typeof req.params;
    }

    if (schemas.query) {
      const queryResult = schemas.query.safeParse(req.query);

      if (!queryResult.success) {
        return next(
          new errors.BadRequest(
            'Invalid query parameters',
            queryResult.error.flatten(),
          ),
        );
      }

      Object.assign(req.query, queryResult.data);
    }

    next();
  };
};
