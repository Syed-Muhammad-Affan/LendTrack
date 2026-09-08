import { Request, Response } from 'express';
import { IWebhookController } from './interface/webhook.controller.interface.js';
import { ISubscriptionRepository } from '../repository/interface/subscription.repository.interface.js';
import { IUserRepository } from '../repository/interface/user.repository.interface.js';
import { StatusCodes } from 'http-status-codes';
import Stripe from 'stripe';
import { stripeClient } from '../services/stripe/stripe.client.js';
import { config } from '../config/config.js';

export class WebhookController implements IWebhookController {
  constructor(
    private readonly SubscriptionRepository: ISubscriptionRepository,
    private readonly UserRepository: IUserRepository,
  ) {}

  async handleStripeWebhook(req: Request, res: Response): Promise<Response> {
    const signature = req.headers['stripe-signature'];

    if (!signature || typeof signature !== 'string') {
      return res.status(StatusCodes.BAD_REQUEST).send('Missing signature');
    }

    let event: Stripe.Event;

    try {
      event = stripeClient.webhooks.constructEvent(
        req.body,
        signature,
        config.stripe.webhookSecret,
      );
    } catch (err: any) {
      console.error('[webhook] Signature verification failed:', err.message);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const providerSubscriptionId = session.subscription as string | null;

        if (!userId || !providerSubscriptionId) {
          console.error(
            '[webhook] Missing userId or subscription on session',
            session.id,
          );
          break;
        }

        const existing = await this.SubscriptionRepository.getByUserId(userId);

        if (existing) {
          await this.SubscriptionRepository.updateByProviderSubscriptionId(
            existing.providerSubscriptionId ?? providerSubscriptionId,
            { providerSubscriptionId, status: 'active' },
          );
        } else {
          await this.SubscriptionRepository.createSubscription({
            userId: userId as any,
            providerSubscriptionId,
            status: 'active',
          });
        }

        await this.UserRepository.updateUser(userId, { plan: 'premium' });
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;

        const status: 'active' | 'canceled' | 'past_due' =
          sub.status === 'active'
            ? 'active'
            : sub.status === 'past_due'
              ? 'past_due'
              : 'canceled';

        const currentPeriodEndUnix = sub.items.data[0]?.current_period_end;

        const updated =
          await this.SubscriptionRepository.updateByProviderSubscriptionId(
            sub.id,
            {
              status,
              ...(currentPeriodEndUnix
                ? { currentPeriodEnd: new Date(currentPeriodEndUnix * 1000) }
                : {}),
            },
          );

        if (updated) {
          await this.UserRepository.updateUser(updated.userId.toString(), {
            plan: status === 'active' ? 'premium' : 'free',
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;

        const updated =
          await this.SubscriptionRepository.updateByProviderSubscriptionId(
            sub.id,
            {
              status: 'canceled',
            },
          );

        if (updated) {
          await this.UserRepository.updateUser(updated.userId.toString(), {
            plan: 'free',
          });
        }
        break;
      }

      default:
        break;
    }

    return res.status(StatusCodes.OK).json({ received: true });
  }
}
