import mongoose, { Schema } from 'mongoose';
import { ILoan } from '../interface/loan.interface.js';
import errors from '../errors/index.js';

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
    },
    borrowedItemName: {
      type: String,
      trim: true,
    },
    direction: {
      type: String,
      enum: ['lent_out', 'borrowed'],
      required: [true, 'Please provide direction'],
    },
    status: {
      type: String,
      enum: ['active', 'returned', 'overdue', 'lost'],
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
    returnedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

LoanSchema.pre('validate', function () {
  if (this.direction === 'lent_out' && !this.itemId) {
    throw new errors.BadRequest(
      'itemId is required when direction is lent_out',
    );
  }

  if (this.direction === 'borrowed' && !this.borrowedItemName) {
    throw new errors.BadRequest(
      'itemDescription is required when direction is borrowed',
    );
  }
});

export default mongoose.model<ILoan>('Loan', LoanSchema);
