import { ISubscription } from '../../interface/subscription.interface.js';

export interface ISubscriptionRepository {
  createSubscription(body: Partial<ISubscription>): Promise<ISubscription>;
  getAllSubscription(userId: string): Promise<ISubscription[] | null>;
  getSingleSubscription(
    subscriptionId: string,
    userId: string,
  ): Promise<ISubscription | null>;
  updateSubscription(
    subscriptionId: string,
    userId: string,
    body: Partial<ISubscription>,
  ): Promise<ISubscription | null>;
  deleteSubscription(
    subscriptionId: string,
    userId: string,
  ): Promise<ISubscription | null>;
}
