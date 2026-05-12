import cors from 'cors';
import env from './env.ts';

export default cors({
  origin: env.CORS_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'x-telegram-init-data',
  ],
  exposedHeaders: ['set-cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
});
