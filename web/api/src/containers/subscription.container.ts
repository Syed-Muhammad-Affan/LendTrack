import { SubscriptionController } from '../controllers/subscription.controller.js';
import { SubscriptionRepository } from '../repository/subscription.repository.js';
import { UserRepository } from '../repository/user.repository.js';
import { SubscriptionRoute } from '../routes/subscription.route.js';
import { SubscriptionService } from '../services/subscription.service/subscription.service.js';
import { createPaymentGateway } from './payment.container.js';

export const createSubscriptionModule = () => {
  const subscriptionService = new SubscriptionService(
    new UserRepository(),
    new SubscriptionRepository(),
    createPaymentGateway(),
  );

  return new SubscriptionRoute(new SubscriptionController(subscriptionService));
};
