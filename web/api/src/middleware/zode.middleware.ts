import { NextFunction, Request, Response } from 'express';
import { BadRequest } from '../errors/bad-request.js';
import z from 'zod';

const validate = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new BadRequest('Validation failed', result.error.flatten());
    }

    req.body = result.data;
    next();
  };
};
