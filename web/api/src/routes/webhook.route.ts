import { Router } from 'express';
import express from 'express';
import { WebhookController } from '../controllers/webhook.controller.js';

export class WebhookRoute {
  public readonly router: Router;

  constructor(private readonly WebhookController: WebhookController) {
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
