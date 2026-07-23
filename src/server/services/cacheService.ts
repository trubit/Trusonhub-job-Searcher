import { redisManager } from '../database/redisClient.js';
import { logger } from '../utils/logger.js';

class CacheService {
  private memoryFallback = new Map<string, { value: string; expiresAt: number }>();

  async get<T>(key: string): Promise<T | null> {
    const client = redisManager.getClient();
    if (client && redisManager.getIsConnected()) {
      try {
        const raw = await client.get(key);
        if (raw) return JSON.parse(raw) as T;
      } catch (err) {
        logger.warn(`Redis cache get error for key ${key}`, { err });
      }
    }

    // In-memory fallback
    const item = this.memoryFallback.get(key);
    if (item) {
      if (Date.now() > item.expiresAt) {
        this.memoryFallback.delete(key);
        return null;
      }
      return JSON.parse(item.value) as T;
    }

    return null;
  }

  async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
    const serialized = JSON.stringify(value);

    const client = redisManager.getClient();
    if (client && redisManager.getIsConnected()) {
      try {
        await client.set(key, serialized, 'EX', ttlSeconds);
        return;
      } catch (err) {
        logger.warn(`Redis cache set error for key ${key}`, { err });
      }
    }

    // In-memory fallback
    this.memoryFallback.set(key, {
      value: serialized,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async del(key: string): Promise<void> {
    const client = redisManager.getClient();
    if (client && redisManager.getIsConnected()) {
      try {
        await client.del(key);
      } catch (err) {
        logger.warn(`Redis cache del error for key ${key}`, { err });
      }
    }
    this.memoryFallback.delete(key);
  }

  async delPattern(pattern: string): Promise<void> {
    const client = redisManager.getClient();
    if (client && redisManager.getIsConnected()) {
      try {
        const keys = await client.keys(pattern);
        if (keys.length > 0) {
          await client.del(...keys);
        }
      } catch (err) {
        logger.warn(`Redis cache delPattern error for pattern ${pattern}`, { err });
      }
    }

    // Memory fallback pattern clearing
    const regexStr = pattern.replace(/\*/g, '.*');
    const regex = new RegExp(`^${regexStr}$`);
    for (const k of this.memoryFallback.keys()) {
      if (regex.test(k)) {
        this.memoryFallback.delete(k);
      }
    }
  }

  async remember<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const fresh = await fetcher();
    if (fresh !== null && fresh !== undefined) {
      await this.set(key, fresh, ttlSeconds);
    }
    return fresh;
  }
}

export const cacheService = new CacheService();
