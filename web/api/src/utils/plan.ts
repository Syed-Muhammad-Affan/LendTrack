import { IUser } from '../interface/user.interface.js';

export function isPremium(user: IUser) {
  if (user.plan !== 'premium') return false;
  if (user.premiumExpiresAt && user.premiumExpiresAt < new Date()) return false;
  return true;
}
