export interface CheckoutSessionResponse {
  url: string;
}

export interface SubscriptionStatusResponse {
  plan: 'free' | 'premium';
  status?: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd?: string;
}