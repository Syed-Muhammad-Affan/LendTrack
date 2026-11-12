import type Stripe from 'stripe';

export interface IBillingWebhookService {
  handleEvent(event: Stripe.Event): Promise<void>;
}
