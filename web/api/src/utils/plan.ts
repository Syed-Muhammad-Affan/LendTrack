import errors from '../errors/index.js';
import { UserRepository } from '../repository/user.repository.js';

export async function isPremium(userId: string) {
  const userRepository = new UserRepository();

  const user = await userRepository.getSingleUserById(userId);

  if (!user) {
    throw new errors.Unauthenticated('Not Authenticated');
  }

  if (user.plan !== 'premium') return false;
  if (user.premiumExpiresAt && user.premiumExpiresAt < new Date()) return false;
  return true;
}
