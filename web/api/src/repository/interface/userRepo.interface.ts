import { Types } from 'mongoose';
import { IUser } from '../../interface/user.interface.js';

export interface IUserRepository {
  createUser(userData: Partial<IUser>): Promise<IUser>;
  getAllUser(): Promise<IUser[] | null>;
  getSingleUserByEmail(email: string): Promise<IUser | null>;
  getSingleUserById(id: Types.ObjectId): Promise<IUser | null>;
  updateUser(id: Types.ObjectId, body: Partial<IUser>): Promise<IUser | null>;
  deleteUser(id: Types.ObjectId): Promise<IUser | null>;
}
