import Stripe from 'stripe';
import { config } from '../../config/config.js';

export const stripeClient = new Stripe(config.stripe.secretKey, {
  apiVersion: '2026-08-26.dahlia',
});
