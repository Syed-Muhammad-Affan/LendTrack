import { NextFunction, Request, Response } from 'express';
import errors from '../errors/index.js';
import { Unauthenticated } from '../errors/unauthenticated.js';
import jwt from 'jsonwebtoken';

interface IPayload extends jwt.JwtPayload {
  id: string;
  name: string;
}

export class auth {
  handle = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      throw new errors.Unauthenticated('Authentication Invalid');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new Unauthenticated('Authentication Invalid');
    }

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as unknown as IPayload;

      req.user = {
        userId: payload.id,
        name: payload.name,
      };

      next();
    } catch (error) {
      throw new Unauthenticated('Authentication Invalid');
    }
  };
}
