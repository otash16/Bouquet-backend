import { createClient } from 'redis';
import { printError } from '../utilities/index.ts';
import env from './env.ts';

const client = createClient({ url: env.REDIS_URL });

client.on('connect', () => {
  console.info('Redis -> Connected successfully!');
});

client.on('error', err => printError(err, 'redis_error'));

export default client;
