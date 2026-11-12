import errors from '../../errors/index.js';
import { IUserRepository } from '../../repository/interface/user.repository.interface.js';
import { IPlanService } from './interface/plan.service.interface.js';

export class PlanService implements IPlanService {
  constructor(private readonly UserRepository: IUserRepository) {}

  async isPremium(userId: string): Promise<boolean> {
    const user = await this.UserRepository.getSingleUserById(userId);

    if (!user) {
      throw new errors.Unauthenticated('Not Authenticated');
    }

    if (user.plan !== 'premium') return false;
    if (user.premiumExpiresAt && user.premiumExpiresAt < new Date()) {
      return false;
    }
    return true;
  }
}
