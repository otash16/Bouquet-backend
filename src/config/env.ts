import { config } from 'dotenv';
import { z } from 'zod/v4';
import Environment from '../constants/environment.ts';

config();

const envSchema = z.object({
  // SERVER
  PORT: z.string().transform((val: string) => Number(val)),
  BASE_URL: z.url(),
  HASH_SALT: z.string().transform((val: string) => Number(val)),
  NODE_ENV: z.enum(Environment),
  CORS_ORIGINS: z.string().transform((val: string) => val.split(',')),

  // DATABASE
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),

  // JWT
  ACCESS_TOKEN_KEY: z.string(),
  ACCESS_TOKEN_TIME: z.string().transform((val: string) => Number(val)),
  REFRESH_TOKEN_KEY: z.string(),
  REFRESH_TOKEN_TIME: z.string().transform((val: string) => Number(val)),

  // TELEGRAM
  TG_BOT_TOKEN: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ .env fayldagi xatolik:', z.treeifyError(parsed.error).properties);
  process.exit(1);
}

export default { ...parsed.data };
