import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { retryWithBackoff } from '../utils/resilience.js';

/**
 * Connect to MongoDB with retry logic.
 */
export async function connectDatabase(): Promise<void> {
  await retryWithBackoff(
    async (attempt) => {
      logger.info(`Attempting MongoDB connection (Attempt #${attempt})...`);
      await mongoose.connect(env.MONGODB_URI, {
        dbName: env.MONGODB_DB_NAME,
        maxPoolSize: 100,
        minPoolSize: 10,
        maxIdleTimeMS: 30000,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      logger.info(`✅ MongoDB connected: ${env.MONGODB_DB_NAME}`);

      mongoose.connection.on('error', (error) => {
        logger.error('MongoDB connection error:', { error });
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected — attempting reconnect...');
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected');
      });
    },
    {
      maxRetries: 5,
      initialDelayMs: 1000,
      maxDelayMs: 10000,
      factor: 2,
      jitter: true,
      onRetry: (err, attempt, delayMs) => {
        logger.warn(`MongoDB connection failed (Attempt #${attempt}): ${err.message}. Retrying in ${delayMs}ms with Jitter...`);
      },
    }
  );
}

/**
 * Gracefully disconnect from MongoDB.
 */
export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected gracefully');
}

/**
 * Check MongoDB connection health.
 */
export function getDatabaseHealth(): { status: 'connected' | 'disconnected' | 'connecting'; readyState: number } {
  const stateMap: Record<number, 'connected' | 'disconnected' | 'connecting'> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnected',
  };

  return {
    status: stateMap[mongoose.connection.readyState] ?? 'disconnected',
    readyState: mongoose.connection.readyState,
  };
}
