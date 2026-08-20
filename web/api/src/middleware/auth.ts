import { NextFunction, Request, Response } from 'express';
import errors from '../errors/index.js';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

interface IPayload extends jwt.JwtPayload {
  id: string;
  name: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  console.log('Authorization:', authHeader);

  if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    throw new errors.Unauthenticated('Authentication Invalid');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new errors.Unauthenticated('Authentication Invalid');
  }

  try {
    const payload = jwt.verify(
      token,
      config.jwt.secret as string,
    ) as unknown as IPayload;

    console.log('JWT payload:', payload);

    req.user = {
      userId: payload.id,
      name: payload.name,
    };

    console.log('req.user:', req.user);

    next();
  } catch (error) {
    throw new errors.Unauthenticated('Authentication Invalid');
  }
};
