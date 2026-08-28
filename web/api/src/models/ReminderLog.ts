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
      required: [true, 'Please provide loan'],
    },
    type: {
      type: String,
      enum: ['pre_due', 'overdue', 'weekly_digest'],
      required: [true, 'Please provide reminder type'],
    },
    status: {
      type: String,
      enum: ['sent', 'failed'],
      required: [true, 'Please provide status'],
    },
    channel: {
      type: String,
      enum: ['email'],
      default: 'email',
    },
    recipientEmail: {
      type: String,
      required: [true, 'Please provide recipient email'],
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
