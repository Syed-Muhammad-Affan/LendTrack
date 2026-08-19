import { NextFunction, Request, Response } from 'express';
import z from 'zod';
import errors from '../errors/index.js';

export const validate = (schemas: { body?: z.ZodType; params?: z.ZodType }) => {
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
    }

    next();
  };
};
