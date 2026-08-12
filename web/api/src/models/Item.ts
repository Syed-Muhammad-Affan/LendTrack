import mongoose, { Schema } from 'mongoose';
import { IItem } from '../interface/item.interface.js';

const ItemSchema = new mongoose.Schema<IItem>(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      maxlength: 50,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      maxlength: 30,
      trim: true,
    },
    photo: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide description'],
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

export default mongoose.model<IItem>('Item', ItemSchema);
