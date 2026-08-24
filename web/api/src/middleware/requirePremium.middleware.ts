import { NextFunction, Request, Response } from 'express';
import errors from '../errors/index.js';
import User from '../models/User.js';
import { isPremium } from '../utils/plan.js';
import { StatusCodes } from 'http-status-codes';
import { UserRepository } from '../repository/user.repository.js';
import { IUserRepository } from '../repository/interface/user.repository.interface.js';

export async function requirePremium(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new errors.Unauthenticated('Not authenticated');
  }

  const userRepository: IUserRepository = new UserRepository();

  const user = await userRepository.getSingleUserById(userId);
  if (!user) {
    throw new errors.Unauthenticated('Not authenticated');
  }

  if (!isPremium(user)) {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: 'This feature requires a premium plan',
      code: 'PREMIUM_REQUIRED',
    });
  }

  next();
}
