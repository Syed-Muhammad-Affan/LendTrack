import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  resetPasswordTokenHash?: string;
  resetPasswordExpires?: string;
  createdAt: Date;
  updatedAt: Date;

  createJWT(): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
