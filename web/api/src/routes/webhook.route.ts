import { Router } from 'express';
import { IWebhookController } from '../controllers/interface/webhook.controller.interface.js';

export class WebhookRoute {
  public readonly router: Router;

  constructor(private readonly WebhookController: IWebhookController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      this.WebhookController.handleStripeWebhook.bind(this.WebhookController),
    );
  }
}
