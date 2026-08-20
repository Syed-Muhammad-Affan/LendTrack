import { Document, Types } from 'mongoose';

export interface IItem extends Document {
  name: string;
  category: string;
  photo?: string;
  description: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  userId: Types.ObjectId;
}
