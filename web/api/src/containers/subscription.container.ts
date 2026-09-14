import { SubscriptionController } from '../controllers/subscription.controller.js';
import { SubscriptionRepository } from '../repository/subscription.repository.js';
import { UserRepository } from '../repository/user.repository.js';
import { SubscriptionRoute } from '../routes/subscription.route.js';
import { SubscriptionService } from '../services/subscription.service/subscription.service.js';

export const createSubscriptionModule = () => {
  const subscriptionRepository = new SubscriptionRepository();
  const userRepository = new UserRepository();

  const subscriptionService = new SubscriptionService(
    userRepository,
    subscriptionRepository,
  );
  const subscriptionController = new SubscriptionController(
    subscriptionService,
  );
  return new SubscriptionRoute(subscriptionController);
};
