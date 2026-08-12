import { Types } from 'mongoose';
import { IUser } from '../../interface/user.interface.js';

export interface IUserRepository {
  createUser(userData: Partial<IUser>): Promise<IUser>;
  getAllUser(): Promise<IUser[] | null>;
  getSingleUserByEmail(email: string): Promise<IUser | null>;
  getSingleUserById(id: string): Promise<IUser | null>;
  updateUser(id: string, body: Partial<IUser>): Promise<IUser | null>;
  deleteUser(id: string): Promise<IUser | null>;
}
