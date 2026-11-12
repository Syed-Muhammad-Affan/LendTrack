import type Stripe from 'stripe';

export interface IPaymentGateway {
  createCustomer(email: string, userId: string): Promise<string>;
  createSubscriptionCheckout(params: {
    customerId: string;
    userId: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<string | null>;
  cancelSubscriptionAtPeriodEnd(providerSubscriptionId: string): Promise<void>;
  verifyWebhook(payload: Buffer, signature: string): Stripe.Event;
  getSubscriptionIdForSession(sessionId: string): Promise<string | undefined>;
}
