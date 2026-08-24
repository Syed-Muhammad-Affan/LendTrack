import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  plan: 'free' | 'premium';
  preferences: { emailReminder: boolean; weeklyDigest: boolean };
  resetPasswordTokenHash?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  premiumExpiresAt: Date;

  createJWT(): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
