import { config } from '../../config/config.js';
import errors from '../../errors/index.js';
import { ISubscriptionRepository } from '../../repository/interface/subscription.repository.interface.js';
import { IUserRepository } from '../../repository/interface/user.repository.interface.js';
import { stripeClient } from '../stripe/stripe.client.js';
import { ISubscriptionService } from './interface/subscription.service.interface.js';

export class SubscriptionService implements ISubscriptionService {
  constructor(
    private readonly UserRepository: IUserRepository,
    private readonly SubscriptionRepository: ISubscriptionRepository,
  ) {}

  async createCheckoutSession(userId: string): Promise<{ url: string }> {
    const user = await this.UserRepository.getSingleUserById(userId);

    if (!user) {
      throw new errors.NotFound('User not found');
    }

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripeClient.customers.create({
        email: user.email,
        metadata: { userId },
      });
      stripeCustomerId = customer.id;

      await this.UserRepository.updateUser(userId, { stripeCustomerId });
    }

    const session = await stripeClient.checkout.sessions.create({
      mode: 'subscription',
      customer: stripeCustomerId,
      line_items: [{ price: config.stripe.priceIdPremium, quantity: 1 }],
      success_url: `${config.app.url}/settings/billing?success=true`,
      cancel_url: `${config.app.url}/settings/billing?canceled=true`,
      metadata: { userId },
    });

    if (!session.url) {
      throw new errors.CustomApiError('Failed to create checkout session', 500);
    }

    return { url: session.url };
  }

  async getStatus(userId: string): Promise<{
    plan: 'free' | 'premium';
    status?: string;
    currentPeriodEnd?: Date;
  }> {
    const subscription = await this.SubscriptionRepository.getByUserId(userId);

    if (!subscription || subscription.status !== 'active') {
      return { plan: 'free' };
    }

    return {
      plan: 'premium',
      status: subscription.status,
      ...(subscription.currentPeriodEnd
        ? { currentPeriodEnd: subscription.currentPeriodEnd }
        : {}),
    };
  }

  async cancelSubscription(userId: string): Promise<void> {
    const subscription = await this.SubscriptionRepository.getByUserId(userId);

    if (!subscription?.providerSubscriptionId) {
      throw new errors.NotFound('No active subscription found');
    }

    // Cancel at period end, not immediately — user keeps access until they've paid for
    await stripeClient.subscriptions.update(
      subscription.providerSubscriptionId,
      {
        cancel_at_period_end: true,
      },
    );
  }
}
