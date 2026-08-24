import { Types, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email?: string;
  phone?: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  userId: Types.ObjectId;
}
