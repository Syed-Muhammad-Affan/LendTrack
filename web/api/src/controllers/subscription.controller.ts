import { Request, Response } from 'express';
import { ISubscriptionController } from './interface/subscription.controller.interface.js';
import { ISubscriptionService } from '../services/subscription.service/interface/subscription.service.interface.js';
import errors from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';

export class SubscriptionController implements ISubscriptionController {
  constructor(private readonly SubscriptionService: ISubscriptionService) {}

  async createCheckoutSession(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new errors.Unauthenticated('Authentication required');
    }

    const result = await this.SubscriptionService.createCheckoutSession(userId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Checkout session created',
      data: result,
    });
  }

  async getStatus(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new errors.Unauthenticated('Authentication required');
    }

    const status = await this.SubscriptionService.getStatus(userId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Subscription status fetched successfully',
      data: status,
    });
  }

  async cancel(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new errors.Unauthenticated('Authentication required');
    }

    await this.SubscriptionService.cancelSubscription(userId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period',
      data: null,
    });
  }
}
