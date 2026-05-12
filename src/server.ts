import app from './app.ts';
import { env, redis } from './config/index.ts';

const PORT = env.PORT;

async function startApp(): Promise<void> {
  await redis.connect();

  app.listen(PORT, () => {
    console.info(`Server -> ${env.BASE_URL}`);
  });
}

startApp().catch(err => console.error(err));
