import mongoose, { Schema } from 'mongoose';
import { ISubscription } from '../interface/subscription.interface.js';

const SubscriptionSchema = new Schema<ISubscription>(
  {
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
    providerSubscriptionId: {
      type: String,
    },
    currentPeriodEnd: {
      type: Date,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ISubscription>(
  'Subscription',
  SubscriptionSchema,
);
