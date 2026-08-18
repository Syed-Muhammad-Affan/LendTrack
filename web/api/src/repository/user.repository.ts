import { Types } from 'mongoose';
import { IUser } from '../interface/user.interface.js';
import User from '../models/User.js';
import { IUserRepository } from './interface/user.repository.interface.js';

export class UserRepository implements IUserRepository {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    return await User.create(userData);
  }

  async getAllUser(): Promise<IUser[] | null> {
    return await User.find();
  }

  async getSingleUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async getSingleUserById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async getSingleUserByResetPasswordToken(
    resetPasswordTokenHash: string,
  ): Promise<IUser | null> {
    return await User.findOne({
      resetPasswordTokenHash: resetPasswordTokenHash,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordTokenHash +resetPasswordExpires');
  }

  async updateUser(id: string, body: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, body, {
      runValidators: true,
      returnDocument: 'after',
    });
  }

  async deleteUser(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id);
  }
}
