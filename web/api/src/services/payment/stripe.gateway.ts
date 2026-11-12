import type Stripe from 'stripe';
import { IPaymentGateway } from './interface/payment.gateway.interface.js';

export class StripeGateway implements IPaymentGateway {
  constructor(
    private readonly stripe: Stripe,
    private readonly options: { priceId: string; webhookSecret: string },
  ) {}

  async createCustomer(email: string, userId: string): Promise<string> {
    const customer = await this.stripe.customers.create({
      email,
      metadata: { userId },
    });
    return customer.id;
  }

  async createSubscriptionCheckout(params: {
    customerId: string;
    userId: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<string | null> {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: params.customerId,
      line_items: [{ price: this.options.priceId, quantity: 1 }],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: { userId: params.userId },
      subscription_data: { metadata: { userId: params.userId } },
    });
    return session.url;
  }

  async cancelSubscriptionAtPeriodEnd(
    providerSubscriptionId: string,
  ): Promise<void> {
    await this.stripe.subscriptions.update(providerSubscriptionId, {
      cancel_at_period_end: true,
    });
  }

  verifyWebhook(payload: Buffer, signature: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.options.webhookSecret,
    );
  }

  async getSubscriptionIdForSession(
    sessionId: string,
  ): Promise<string | undefined> {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    });
    return typeof session.subscription === 'string'
      ? session.subscription
      : session.subscription?.id;
  }
}
