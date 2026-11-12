import { config } from '../../config/config.js';
import errors from '../../errors/index.js';
import { ISubscriptionRepository } from '../../repository/interface/subscription.repository.interface.js';
import { IUserRepository } from '../../repository/interface/user.repository.interface.js';
import { IPaymentGateway } from '../payment/interface/payment.gateway.interface.js';
import { ISubscriptionService } from './interface/subscription.service.interface.js';

export class SubscriptionService implements ISubscriptionService {
  constructor(
    private readonly UserRepository: IUserRepository,
    private readonly SubscriptionRepository: ISubscriptionRepository,
    private readonly PaymentGateway: IPaymentGateway,
  ) {}

  async createCheckoutSession(userId: string): Promise<{ url: string }> {
    const user = await this.UserRepository.getSingleUserById(userId);

    if (!user) {
      throw new errors.NotFound('User not found');
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      customerId = await this.PaymentGateway.createCustomer(user.email, userId);
      await this.UserRepository.updateUser(userId, {
        stripeCustomerId: customerId,
      });
    }

    const url = await this.PaymentGateway.createSubscriptionCheckout({
      customerId,
      userId,
      successUrl: `${config.app.url}/settings/billing?success=true`,
      cancelUrl: `${config.app.url}/settings/billing?canceled=true`,
    });

    if (!url) {
      throw new errors.CustomApiError('Failed to create checkout session', 500);
    }

    return { url };
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

    // Cancel at period end so the paid-for access is kept
    await this.PaymentGateway.cancelSubscriptionAtPeriodEnd(
      subscription.providerSubscriptionId,
    );
  }
}
