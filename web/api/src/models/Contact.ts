import mongoose, { Types, Schema } from 'mongoose';
import { IContact } from '../interface/contact.interface.js';

const ContactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      maxlength: 50,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    PhoneNumber: {
      type: String,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true },
);

export default mongoose.model<IContact>('Contact', ContactSchema);
