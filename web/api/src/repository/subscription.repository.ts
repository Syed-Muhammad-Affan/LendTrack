import { ISubscription } from '../interface/subscription.interface.js';
import Subscription from '../models/Subscription.js';
import { ISubscriptionRepository } from './interface/subscription.repository.interface.js';

export class SubscriptionRepository implements ISubscriptionRepository {
  async createSubscription(
    body: Partial<ISubscription>,
  ): Promise<ISubscription> {
    return await Subscription.create(body);
  }

  async getByUserId(userId: string): Promise<ISubscription | null> {
    return await Subscription.findOne({ userId });
  }

  async getByProviderSubscriptionId(
    providerSubscriptionId: string,
  ): Promise<ISubscription | null> {
    return await Subscription.findOne({ providerSubscriptionId });
  }

  async updateByProviderSubscriptionId(
    providerSubscriptionId: string,
    body: Partial<ISubscription>,
  ): Promise<ISubscription | null> {
    return await Subscription.findOneAndUpdate(
      { providerSubscriptionId },
      body,
      {
        new: true,
        runValidators: true,
      },
    );
  }
}
