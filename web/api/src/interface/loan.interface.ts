import { Document, Types } from 'mongoose';

export interface ILoan extends Document {
  userId: Types.ObjectId;
  itemId: Types.ObjectId;
  contactId: Types.ObjectId;
  direction: 'lent_out' | 'borrowed';
  status: 'active' | 'returned' | 'overdue' | 'lost';
  loanedAt: Date;
  expectedReturnAt: Date;
  returnAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
