import { redis } from '../config/index.ts';

class RedisService {
  #client;
  constructor() {
    this.#client = redis;
  }

  async get(key: string): Promise<any> {
    const value: string | null = await this.#client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl = 3600): Promise<any> {
    await this.#client.set(key, JSON.stringify(value), { EX: ttl });
    return this.get(key);
  }

  async del(key: string) {
    return this.#client.del(key);
  }
}

export default new RedisService();
