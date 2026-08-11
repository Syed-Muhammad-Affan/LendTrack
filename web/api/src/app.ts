import express from 'express';
import { ErrorHandler } from './middleware/error-handler.js';
import { NotFound } from './middleware/notFound.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';

const errorHandler = new ErrorHandler();
const notFound = new NotFound();

const app = express();

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

app.use(notFound.handle);
app.use(errorHandler.handle);

export default app;
