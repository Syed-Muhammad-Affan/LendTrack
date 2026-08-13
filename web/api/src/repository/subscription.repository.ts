import { ISubscription } from '../interface/subscription.interface.js';
import Subscription from '../models/Subscription.js';
import { ISubscriptionRepository } from './interface/subscription.repository.interface.js';

export class SubscriptionRepository implements ISubscriptionRepository {
  async createSubscription(
    body: Partial<ISubscription>,
  ): Promise<ISubscription> {
    return await Subscription.create(body);
  }

  async getAllSubscription(userId: string): Promise<ISubscription[] | null> {
    return await Subscription.find({ userId: userId }).sort('createdAt');
  }

  async getSingleSubscription(
    subscriptionId: string,
    userId: string,
  ): Promise<ISubscription | null> {
    return await Subscription.findOne({ _id: subscriptionId, userId: userId });
  }

  async updateSubscription(
    subscriptionId: string,
    userId: string,
    body: Partial<ISubscription>,
  ): Promise<ISubscription | null> {
    return await Subscription.findOneAndUpdate(
      { _id: subscriptionId, userId: userId },
      body,
      {
        runValidators: true,
        returnDocument: 'after',
      },
    );
  }

  async deleteSubscription(
    subscriptionId: string,
    userId: string,
  ): Promise<ISubscription | null> {
    return await Subscription.findOneAndDelete({
      _id: subscriptionId,
      userId: userId,
    });
  }
}
