export interface ISubscriptionService {
  createCheckoutSession(userId: string): Promise<{ url: string }>;
  getStatus(userId: string): Promise<{
    plan: 'free' | 'premium';
    status?: string;
    currentPeriodEnd?: Date;
  }>;
  cancelSubscription(userId: string): Promise<void>;
}
