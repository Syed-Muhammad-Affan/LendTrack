import mongoose, { Schema } from 'mongoose';
import { ILoan } from '../interface/loan.interface.js';

const LoanSchema = new Schema<ILoan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
    contactId: {
      type: Schema.Types.ObjectId,
      ref: 'Contact',
      required: [true, 'Please provide contact'],
    },
    itemId: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: [true, 'Please provide item'],
    },
    direction: {
      type: String,
      enum: ['lent_out', 'borrowed'],
      required: [true, 'Please provide direction'],
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'overdue', 'lost'],
      default: 'active',
    },
    loanedAt: {
      type: Date,
      required: [true, 'Please provide date of loan'],
    },
    expectedReturnAt: {
      type: Date,
      required: [true, 'Please provide date of expected return'],
    },
    returnAt: {
      type: Date,
      required: [true, 'Please provide date of return'],
    },
  },
  { timestamps: true },
);

export default mongoose.model<ILoan>('Loan', LoanSchema);
