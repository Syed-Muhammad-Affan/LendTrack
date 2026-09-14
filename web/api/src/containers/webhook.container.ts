import { WebhookController } from '../controllers/webhook.controller.js';
import { SubscriptionRepository } from '../repository/subscription.repository.js';
import { UserRepository } from '../repository/user.repository.js';
import { WebhookRoute } from '../routes/webhook.route.js';

export const createWebhookModule = () => {
  const subscriptionRepository = new SubscriptionRepository();
  const userRepository = new UserRepository();

  const webhookController = new WebhookController(
    subscriptionRepository,
    userRepository,
  );
  return new WebhookRoute(webhookController);
};
