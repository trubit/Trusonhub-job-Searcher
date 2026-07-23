import { Redis } from 'ioredis';
import { env, isDev } from '../config/env.js';
import { logger } from '../utils/logger.js';

class RedisClientManager {
  private client: Redis | null = null;
  private isConnected = false;

  constructor() {
    if (env.REDIS_URL) {
      try {
        this.client = new Redis(env.REDIS_URL, {
          maxRetriesPerRequest: 3,
          retryStrategy(times) {
            const delay = Math.min(times * 100, 3000);
            return delay;
          },
          lazyConnect: true,
        });

        this.client.on('connect', () => {
          this.isConnected = true;
          logger.info('✅ Redis connected successfully');
        });

        this.client.on('error', (err) => {
          this.isConnected = false;
          if (!isDev) {
            logger.error('Redis Client Error', { error: err.message });
          }
        });
      } catch (error) {
        logger.warn('Failed to initialize Redis client connection', { error });
      }
    }
  }

  async connect(): Promise<void> {
    if (this.client && !this.isConnected) {
      try {
        await this.client.connect();
      } catch (error) {
        logger.warn('Redis connect attempt failed — running with in-memory fallback', { error });
      }
    }
  }

  getClient(): Redis | null {
    return this.client;
  }

  getIsConnected(): boolean {
    return this.isConnected;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
      logger.info('Redis connection closed gracefully');
    }
  }
}

export const redisManager = new RedisClientManager();
