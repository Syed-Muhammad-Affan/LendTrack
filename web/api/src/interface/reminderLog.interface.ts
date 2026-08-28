import { Document, Types } from 'mongoose';

export interface IReminderLog extends Document {
  userId: Types.ObjectId;
  loanId: Types.ObjectId;
  type: 'pre_due' | 'overdue' | 'weekly_digest';
  status: 'sent' | 'failed';
  channel: 'email';
  recipientEmail: string;
  sentAt: Date;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}
