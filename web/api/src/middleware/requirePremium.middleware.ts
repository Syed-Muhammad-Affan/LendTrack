import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import errors from '../errors/index.js';
import { IPlanService } from '../services/plan.service/interface/plan.service.interface.js';

export const requirePremium =
  (planService: IPlanService) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new errors.Unauthenticated('Not authenticated');
    }

    if (!(await planService.isPremium(userId))) {
      res.status(StatusCodes.FORBIDDEN).json({
        message: 'This feature requires a premium plan',
        code: 'PREMIUM_REQUIRED',
      });
      return;
    }

    next();
  };
