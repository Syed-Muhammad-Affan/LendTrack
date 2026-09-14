// import { Request, Response } from 'express';
// import { IWebhookController } from './interface/webhook.controller.interface.js';
// import { ISubscriptionRepository } from '../repository/interface/subscription.repository.interface.js';
// import { IUserRepository } from '../repository/interface/user.repository.interface.js';
// import { StatusCodes } from 'http-status-codes';
// import Stripe from 'stripe';
// import { stripeClient } from '../services/stripe/stripe.client.js';
// import { config } from '../config/config.js';

// export class WebhookController implements IWebhookController {
//   constructor(
//     private readonly SubscriptionRepository: ISubscriptionRepository,
//     private readonly UserRepository: IUserRepository,
//   ) {}

//   async handleStripeWebhook(req: Request, res: Response): Promise<Response> {
//     console.log('[webhook] Request received at', new Date().toISOString());
//     console.log(
//       '[webhook] Headers:',
//       req.headers['stripe-signature'] ? 'signature present' : 'NO SIGNATURE',
//     );
//     console.log(
//       '[webhook] Body type:',
//       Buffer.isBuffer(req.body) ? 'Buffer (correct)' : typeof req.body,
//     );

//     const signature = req.headers['stripe-signature'];

//     if (!signature || typeof signature !== 'string') {
//       return res.status(StatusCodes.BAD_REQUEST).send('Missing signature');
//     }

//     let event: Stripe.Event;

//     try {
//       event = stripeClient.webhooks.constructEvent(
//         req.body,
//         signature,
//         config.stripe.webhookSecret,
//       );
//     } catch (err: any) {
//       console.error('[webhook] Signature verification failed:', err.message);
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .send(`Webhook Error: ${err.message}`);
//     }

//     switch (event.type) {
//       // controllers/webhook.controller.ts
//       case 'checkout.session.completed': {
//         const session = event.data.object as Stripe.Checkout.Session;
//         const userId = session.metadata?.userId;

//         // 1. Extract subscription ID (handles string or expanded object)
//         let providerSubscriptionId =
//           typeof session.subscription === 'string'
//             ? session.subscription
//             : session.subscription?.id;

//         // 2. Fallback: If subscription ID is missing on session, fetch session from Stripe API
//         if (!providerSubscriptionId && session.id) {
//           const expandedSession = await stripeClient.checkout.sessions.retrieve(
//             session.id,
//             { expand: ['subscription'] },
//           );
//           providerSubscriptionId =
//             typeof expandedSession.subscription === 'string'
//               ? expandedSession.subscription
//               : expandedSession.subscription?.id;
//         }

//         console.log('[webhook] checkout.session.completed payload:', {
//           userId,
//           providerSubscriptionId,
//           customer: session.customer,
//         });

//         if (!userId) {
//           console.error(
//             '[webhook] Skipped: userId is missing from session metadata',
//           );
//           break;
//         }

//         if (!providerSubscriptionId) {
//           console.error(
//             '[webhook] Skipped: providerSubscriptionId could not be found',
//           );
//           break;
//         }

//         // 3. Save / Update Subscription in Database
//         const existing = await this.SubscriptionRepository.getByUserId(userId);

//         if (existing) {
//           await this.SubscriptionRepository.updateByProviderSubscriptionId(
//             existing.providerSubscriptionId ?? providerSubscriptionId,
//             { providerSubscriptionId, status: 'active' },
//           );
//         } else {
//           await this.SubscriptionRepository.createSubscription({
//             userId: userId as any,
//             providerSubscriptionId,
//             status: 'active',
//           });
//         }

//         // 4. Update User Plan to Premium
//         await this.UserRepository.updateUser(userId, { plan: 'premium' });
//         console.log(`[webhook] SUCCESS: User ${userId} upgraded to premium!`);
//         break;
//       }

//       case 'customer.subscription.updated': {
//         const sub = event.data.object as Stripe.Subscription;

//         const status: 'active' | 'canceled' | 'past_due' =
//           sub.status === 'active'
//             ? 'active'
//             : sub.status === 'past_due'
//               ? 'past_due'
//               : 'canceled';

//         const currentPeriodEndUnix = sub.items.data[0]?.current_period_end;

//         const updated =
//           await this.SubscriptionRepository.updateByProviderSubscriptionId(
//             sub.id,
//             {
//               status,
//               ...(currentPeriodEndUnix
//                 ? { currentPeriodEnd: new Date(currentPeriodEndUnix * 1000) }
//                 : {}),
//             },
//           );

//         if (updated) {
//           await this.UserRepository.updateUser(updated.userId.toString(), {
//             plan: status === 'active' ? 'premium' : 'free',
//           });
//         }
//         break;
//       }

//       case 'customer.subscription.deleted': {
//         const sub = event.data.object as Stripe.Subscription;

//         const updated =
//           await this.SubscriptionRepository.updateByProviderSubscriptionId(
//             sub.id,
//             {
//               status: 'canceled',
//             },
//           );

//         if (updated) {
//           await this.UserRepository.updateUser(updated.userId.toString(), {
//             plan: 'free',
//           });
//         }
//         break;
//       }

//       default:
//         break;
//     }

//     return res.status(StatusCodes.OK).json({ received: true });
//   }
// }

import { Request, Response } from 'express';
import { IWebhookController } from './interface/webhook.controller.interface.js';
import { ISubscriptionRepository } from '../repository/interface/subscription.repository.interface.js';
import { IUserRepository } from '../repository/interface/user.repository.interface.js';
import { StatusCodes } from 'http-status-codes';
import Stripe from 'stripe';
import { stripeClient } from '../services/stripe/stripe.client.js';
import { config } from '../config/config.js';

export class WebhookController implements IWebhookController {
  constructor(
    private readonly SubscriptionRepository: ISubscriptionRepository,
    private readonly UserRepository: IUserRepository,
  ) {}

  async handleStripeWebhook(req: Request, res: Response): Promise<Response> {
    console.log('\n================ WEBHOOK EVENT INCOMING ================');
    console.log('[webhook] Timestamp:', new Date().toISOString());

    const signature = req.headers['stripe-signature'];

    if (!signature || typeof signature !== 'string') {
      console.error('[webhook] ERROR: Missing stripe-signature header');
      return res.status(StatusCodes.BAD_REQUEST).send('Missing signature');
    }

    let event: Stripe.Event;

    try {
      event = stripeClient.webhooks.constructEvent(
        req.body,
        signature,
        config.stripe.webhookSecret,
      );
      console.log('[webhook] Verified Event Type:', event.type);
    } catch (err: any) {
      console.error(
        '[webhook] ERROR: Signature verification failed:',
        err.message,
      );
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('[webhook] Checkout Session Data:', {
          id: session.id,
          customer: session.customer,
          subscription: session.subscription,
          metadata: session.metadata,
        });

        let userId = session.metadata?.userId;

        // If userId is missing from session metadata, attempt to find user by Stripe Customer ID
        if (!userId && session.customer) {
          const customerId =
            typeof session.customer === 'string'
              ? session.customer
              : session.customer.id;
          const user = await this.UserRepository.getSingleUserById(customerId); // or find by stripeCustomerId
          if (user) userId = user._id.toString();
        }

        let providerSubscriptionId =
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id;

        // Fallback: If session doesn't contain subscription ID yet, retrieve session directly from Stripe
        if (!providerSubscriptionId && session.id) {
          try {
            const fetchedSession =
              await stripeClient.checkout.sessions.retrieve(session.id, {
                expand: ['subscription'],
              });
            providerSubscriptionId =
              typeof fetchedSession.subscription === 'string'
                ? fetchedSession.subscription
                : fetchedSession.subscription?.id;
          } catch (e) {
            console.error(
              '[webhook] Failed to retrieve session from Stripe:',
              e,
            );
          }
        }

        if (!userId) {
          console.error(
            '[webhook] CRITICAL CRASH PREVENTED: No userId in session metadata!',
          );
          break;
        }

        if (!providerSubscriptionId) {
          console.error(
            '[webhook] CRITICAL CRASH PREVENTED: No providerSubscriptionId found!',
          );
          break;
        }

        console.log(
          `[webhook] Updating DB for User: ${userId}, Sub: ${providerSubscriptionId}`,
        );

        const existing = await this.SubscriptionRepository.getByUserId(userId);

        if (existing) {
          await this.SubscriptionRepository.updateByProviderSubscriptionId(
            existing.providerSubscriptionId ?? providerSubscriptionId,
            { providerSubscriptionId, status: 'active' },
          );
        } else {
          await this.SubscriptionRepository.createSubscription({
            userId: userId as any,
            providerSubscriptionId,
            status: 'active',
          });
        }

        await this.UserRepository.updateUser(userId, { plan: 'premium' });
        console.log(`[webhook] SUCCESS 🎉 User ${userId} upgraded to premium!`);
        break;
      }

      default:
        console.log(`[webhook] Ignored unhandled event type: ${event.type}`);
        break;
    }

    return res.status(StatusCodes.OK).json({ received: true });
  }
}
