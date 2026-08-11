import mongoose, { Schema } from 'mongoose';
import { ISubscription } from '../interface/subscription.interface.js';

const SubscriptionSchema = new Schema<ISubscription>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },
  status: {
    type: String,
    enum: ['active', 'canceled', 'past_due'],
    required: [true, 'Please provide status'],
  },
  stripeCustomerId: {
    type: String,
    required: [true, 'Please provide Stripe Customer ID'],
  },
  stripeSubscriptionId: {
    type: String,
    required: [true, 'Please provide Stripe Subscription ID'],
  },
  currentPeriodEnd: {
    type: Date,
  },
});

export default mongoose.model<ISubscription>(
  'Subscription',
  SubscriptionSchema,
);
