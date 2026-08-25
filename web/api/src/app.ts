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

const errorHandler = new ErrorHandler();
const notFound = new NotFound();

const app = express();

const authRoute = createAuthModule();
const contactRoute = createContactModule();
const itemRoute = createItemModule();
const loanRoute = createLoanModule();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }),
);

// Middleware
app.use('/api/v1/auth', authRoute.router);
app.use('/api/v1/contacts', authMiddleware, contactRoute.router);
app.use('/api/v1/items', authMiddleware, itemRoute.router);
app.use('/api/v1/loans', authMiddleware, loanRoute.router);

app.use(notFound.handle);
app.use(errorHandler.handle);

export default app;
