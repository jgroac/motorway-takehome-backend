import { createClient, RedisClientType } from 'redis';
import { REDIS_URL } from '../config';
import logger from '../utils/logger';

class Redis {
  public static keyTTLInSeconds = 60;
  private client: RedisClientType;
  private connectedClient: RedisClientType | null = null;

  constructor(create: typeof createClient) {
    this.client = create({
      url: REDIS_URL,
    });
  }

  async connect() {
    if (!this.connectedClient) {
      this.connectedClient = await this.client
        .on('error', (err) => {
          logger.error(`Cant connect to redis: ${err}`);
          this.client.disconnect();
        })
        .connect();
    }

    return this.connectedClient;
  }

  async get(key: string) {
    let resource = null;
    try {
      const c = await this.connect();
      resource = await c.get(key);
    } catch (error) {
      logger.warn(`Failed to retrieve ${key} from cache`);
    }

    return resource;
  }

  async set(key: string, value: any) {
    try {
      const c = await this.connect();
      await c.set(key, value, {
        EX: Redis.keyTTLInSeconds,
      });
    } catch (err) {
      logger.warn(`Failed to cache resource with key ${key}`);
    }
  }

  async disconnect() {
    await this.connectedClient?.disconnect();
  }
}

const redis = new Redis(createClient);

export default redis;
