import { WebhookController } from '../controllers/webhook.controller.js';
import { SubscriptionRepository } from '../repository/subscription.repository.js';
import { UserRepository } from '../repository/user.repository.js';
import { WebhookRoute } from '../routes/webhook.route.js';
import { BillingWebhookService } from '../services/billing.webhook.service/billing.webhook.service.js';
import { createPaymentGateway } from './payment.container.js';

export const createWebhookModule = () => {
  const gateway = createPaymentGateway();
  const billingWebhookService = new BillingWebhookService(
    new SubscriptionRepository(),
    new UserRepository(),
    gateway,
  );

  return new WebhookRoute(
    new WebhookController(gateway, billingWebhookService),
  );
};
