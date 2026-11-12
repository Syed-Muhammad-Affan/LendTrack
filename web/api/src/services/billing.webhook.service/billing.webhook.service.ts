import type Stripe from 'stripe';
import { ISubscriptionRepository } from '../../repository/interface/subscription.repository.interface.js';
import { IUserRepository } from '../../repository/interface/user.repository.interface.js';
import { IPaymentGateway } from '../payment/interface/payment.gateway.interface.js';
import { IBillingWebhookService } from './interface/billing.webhook.service.interface.js';

type EventHandler = (event: Stripe.Event) => Promise<void>;
type SubscriptionStatus = 'active' | 'canceled' | 'past_due';

export class BillingWebhookService implements IBillingWebhookService {
  // Add a new event type by registering a handler here, no switch to edit.
  private readonly handlers: Record<string, EventHandler> = {
    'checkout.session.completed': (e) =>
      this.onCheckoutCompleted(e.data.object as Stripe.Checkout.Session),
    'customer.subscription.updated': (e) =>
      this.onSubscriptionUpdated(e.data.object as Stripe.Subscription),
    'customer.subscription.deleted': (e) =>
      this.onSubscriptionDeleted(e.data.object as Stripe.Subscription),
  };

  constructor(
    private readonly SubscriptionRepository: ISubscriptionRepository,
    private readonly UserRepository: IUserRepository,
    private readonly PaymentGateway: IPaymentGateway,
  ) {}

  async handleEvent(event: Stripe.Event): Promise<void> {
    await this.handlers[event.type]?.(event);
  }

  private async onCheckoutCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    const userId = session.metadata?.userId;
    if (!userId) {
      console.error('[webhook] Skipped: userId missing from session metadata');
      return;
    }

    let providerSubscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id;

    if (!providerSubscriptionId) {
      providerSubscriptionId =
        await this.PaymentGateway.getSubscriptionIdForSession(session.id);
    }

    if (!providerSubscriptionId) {
      console.error('[webhook] Skipped: subscription id not found');
      return;
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
  }

  private async onSubscriptionUpdated(sub: Stripe.Subscription): Promise<void> {
    const status: SubscriptionStatus =
      sub.status === 'active'
        ? 'active'
        : sub.status === 'past_due'
          ? 'past_due'
          : 'canceled';

    const periodEnd = sub.items.data[0]?.current_period_end;

    const updated =
      await this.SubscriptionRepository.updateByProviderSubscriptionId(sub.id, {
        status,
        ...(periodEnd ? { currentPeriodEnd: new Date(periodEnd * 1000) } : {}),
      });

    if (updated) {
      await this.UserRepository.updateUser(updated.userId.toString(), {
        plan: status === 'active' ? 'premium' : 'free',
      });
    }
  }

  private async onSubscriptionDeleted(sub: Stripe.Subscription): Promise<void> {
    const updated =
      await this.SubscriptionRepository.updateByProviderSubscriptionId(sub.id, {
        status: 'canceled',
      });

    if (updated) {
      await this.UserRepository.updateUser(updated.userId.toString(), {
        plan: 'free',
      });
    }
  }
}
