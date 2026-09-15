import express from 'express';
import { ErrorHandler } from './middleware/error-handler.js';
import { NotFound } from './middleware/notFound.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { createAuthModule } from './containers/auth.container.js';
import { createContactModule } from './containers/contact.container.js';
import { authMiddleware } from './middleware/auth.js';
import { createItemModule } from './containers/item.container.js';
import { createLoanModule } from './containers/loan.container.js';
import { createReminderLogModule } from './containers/reminderLog.container.js';
import { createSubscriptionModule } from './containers/subscription.container.js';
import { createWebhookModule } from './containers/webhook.container.js';
import { apiReference } from '@scalar/express-api-reference';
import { generateOpenApiDocument } from './openapi/generate-document.js';

const errorHandler = new ErrorHandler();
const notFound = new NotFound();

const app = express();

const authRoute = createAuthModule();
const contactRoute = createContactModule();
const itemRoute = createItemModule();
const loanRoute = createLoanModule();
const reminderLogRoute = createReminderLogModule();
const subscriptionRoute = createSubscriptionModule();
const webhookRoute = createWebhookModule();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors());

app.use(
  '/api/v1/billing/webhook',
  express.raw({ type: 'application/json' }),
  webhookRoute.router,
);

app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }),
);

const openApiDocument = generateOpenApiDocument();

app.get('/openapi.json', (req, res) => {
  res.json(openApiDocument);
});

app.use(
  '/docs',
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        'style-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        'img-src': ["'self'", 'data:', 'https:'],
        'connect-src': ["'self'", 'https://cdn.jsdelivr.net'],
      },
    },
  }),
  apiReference({
    spec: { url: '/openapi.json' },
    theme: 'purple',
  }),
);

// Middleware
app.use('/api/v1/auth', authRoute.router);
app.use('/api/v1/contacts', authMiddleware, contactRoute.router);
app.use('/api/v1/items', authMiddleware, itemRoute.router);
app.use('/api/v1/loans', authMiddleware, loanRoute.router);
app.use('/api/v1/reminder-log', authMiddleware, reminderLogRoute.router);
app.use('/api/v1/billing', authMiddleware, subscriptionRoute.router);

app.use(notFound.handle);
app.use(errorHandler.handle);

export default app;
