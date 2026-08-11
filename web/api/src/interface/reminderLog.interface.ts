import { Document, Types } from 'mongoose';

export interface IReminderLog extends Document {
  userId: Types.ObjectId;
  loanId: Types.ObjectId;
  type: 'pre_due' | 'overdue' | 'weekly_digest';
  status: 'sent' | 'failed';
  sentAt: Date;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}
