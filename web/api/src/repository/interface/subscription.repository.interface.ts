import { ISubscription } from '../../interface/subscription.interface.js';

export interface ISubscriptionRepository {
  createSubscription(body: Partial<ISubscription>): Promise<ISubscription>;
  getByUserId(userId: string): Promise<ISubscription | null>;
  getByProviderSubscriptionId(
    providerSubscriptionId: string,
  ): Promise<ISubscription | null>;
  updateByProviderSubscriptionId(
    providerSubscriptionId: string,
    body: Partial<ISubscription>,
  ): Promise<ISubscription | null>;
}
