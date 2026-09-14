import { Router } from 'express';
import { SubscriptionController } from '../controllers/subscription.controller.js';
import { validate } from '../middleware/zod.middleware.js';

export class SubscriptionRoute {
  public readonly router: Router;

  constructor(private readonly SubscriptionController: SubscriptionController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/create-checkout-session',
      this.SubscriptionController.createCheckoutSession.bind(
        this.SubscriptionController,
      ),
    );

    this.router.get(
      '/status',
      this.SubscriptionController.getStatus.bind(this.SubscriptionController),
    );

    this.router.post(
      '/cancel',
      this.SubscriptionController.cancel.bind(this.SubscriptionController),
    );
  }
}
