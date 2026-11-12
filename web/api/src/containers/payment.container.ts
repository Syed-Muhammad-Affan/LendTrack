import { stripeClient } from '../services/stripe/stripe.client.js';
import { StripeGateway } from '../services/payment/stripe.gateway.js';
import { config } from '../config/config.js';

export const createPaymentGateway = () =>
  new StripeGateway(stripeClient, {
    priceId: config.stripe.priceIdPremium,
    webhookSecret: config.stripe.webhookSecret,
  });
