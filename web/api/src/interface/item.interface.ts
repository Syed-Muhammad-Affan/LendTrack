import { Document, Types } from 'mongoose';

export interface IItem extends Document {
  name: string;
  category: string;
  photo?: string;
  description: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: Types.ObjectId;
}
