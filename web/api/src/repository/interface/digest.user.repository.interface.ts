import { IUser } from '../../interface/user.interface.js';

export interface IDigestUserRepository {
  getPremiumUsersWithDigestEnabled(): Promise<IUser[]>;
}
