import mongoose, { Schema } from 'mongoose';
import { IReminderLog } from '../interface/reminderLog.interface.js';

const RemainderLogSchema = new Schema<IReminderLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
    loanId: {
      type: Schema.Types.ObjectId,
      ref: 'Loan',
      required: [true, 'Please provide loan product'],
    },
    type: {
      type: String,
      enum: ['pre_due', 'overdue', 'weekly_digest'],
      required: [true, 'Please provide type of loan'],
    },
    status: {
      type: String,
      enum: ['sent', 'failed'],
      required: [true, 'Please provide status'],
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    errorMessage: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model('ReminderLog', RemainderLogSchema);
