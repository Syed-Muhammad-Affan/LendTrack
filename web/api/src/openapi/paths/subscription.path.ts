// openapi/paths/subscription.paths.ts
import { z } from 'zod';
import { registry, bearerAuth } from '../registry.js';

const checkoutSessionResponseSchema = z
  .object({
    url: z
      .string()
      .url()
      .openapi({ example: 'https://checkout.stripe.com/c/pay/cs_test_...' }),
  })
  .openapi('CheckoutSessionResponse');

export const subscriptionStatusResponseSchema = z
  .object({
    plan: z.enum(['free', 'premium']),
    status: z.enum(['active', 'canceled', 'past_due']).optional(),
    currentPeriodEnd: z.string().datetime().optional(),
  })
  .openapi('SubscriptionStatusResponse');

registry.registerPath({
  method: 'post',
  path: '/api/v1/billing/create-checkout-session',
  tags: ['Billing'],
  summary: 'Create a Stripe checkout session for Premium upgrade',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: 'Checkout session URL',
      content: {
        'application/json': { schema: checkoutSessionResponseSchema },
      },
    },
    401: { description: 'Authentication required' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/billing/status',
  tags: ['Billing'],
  summary: 'Get current subscription status',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: {
      description: 'Subscription status',
      content: {
        'application/json': { schema: subscriptionStatusResponseSchema },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/billing/cancel',
  tags: ['Billing'],
  summary: 'Cancel subscription (takes effect at period end)',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: { description: 'Cancellation scheduled' },
    404: { description: 'No active subscription found' },
  },
});
