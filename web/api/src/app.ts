import express from 'express';
import { ErrorHandler } from './middleware/error-handler.js';
import { NotFound } from './middleware/notFound.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import { AuthRoute } from './routes/auth.routes.js';
import { createAuthModule } from './container.ts/auth.container.js';

const errorHandler = new ErrorHandler();
const notFound = new NotFound();

const app = express();

const authRoute = createAuthModule();

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
app.use(xss());

// Middleware
app.use('/api/v1/auth', authRoute.router);

app.use(notFound.handle);
app.use(errorHandler.handle);

export default app;
