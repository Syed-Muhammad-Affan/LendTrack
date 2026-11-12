import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type Stripe from 'stripe';
import { IWebhookController } from './interface/webhook.controller.interface.js';
import { IPaymentGateway } from '../services/payment/interface/payment.gateway.interface.js';
import { IBillingWebhookService } from '../services/billing.webhook.service/interface/billing.webhook.service.interface.js';

export class WebhookController implements IWebhookController {
  constructor(
    private readonly PaymentGateway: IPaymentGateway,
    private readonly BillingWebhookService: IBillingWebhookService,
  ) {}

  async handleStripeWebhook(req: Request, res: Response): Promise<Response> {
    const signature = req.headers['stripe-signature'];

    if (!signature || typeof signature !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).send('Missing signature');
    }

    let event: Stripe.Event;
    try {
      event = this.PaymentGateway.verifyWebhook(req.body, signature);
    } catch {
      return res.status(StatusCodes.BAD_REQUEST).send('Invalid signature');
    }

    await this.BillingWebhookService.handleEvent(event);

    return res.status(StatusCodes.OK).json({ received: true });
  }
}
