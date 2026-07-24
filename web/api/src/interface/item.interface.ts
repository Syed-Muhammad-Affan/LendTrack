import { Document } from 'mongoose';

export interface IItem extends Document {
  name: string;
  category: string;
  photo?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
