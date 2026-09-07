import { Document, Types } from 'mongoose';

export interface ISubscription extends Document {
  userId: Types.ObjectId;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd?: Date;
  providerSubscriptionId: string;
  createdAt: Date;
  updatedAt: Date;
}
