import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cookieParser from 'cookie-parser';
import express, { type Application } from 'express';
import indexRouter from './api/index.routes.ts';
import { cors, logger } from './config/index.ts';
import { errorHandler, notFoundHandler, responseHandler } from './middlewares/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();

// Settings
app.enable('trust proxy');
app.disable('x-powered-by');

// CORS
app.use(cors);

// Logger
app.use(logger());

// Healthcheck
app.get('/healthz', (_req, res) => {
  res.sendStatus(200);
});

// Response handler
app.use(responseHandler);

// Middleware
app.use(express.json({ limit: '500kb' }));
app.use(cookieParser());

// Static files — rasmlar uchun
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/', indexRouter);

// Not found handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

export default app;
