import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.ts';
import env from './env.ts';

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

const db = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

export default db;
