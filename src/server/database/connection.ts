import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

/**
 * Connect to MongoDB with retry logic.
 */
export async function connectDatabase(retries = MAX_RETRIES): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DB_NAME,
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
  } catch (error) {
    if (retries > 0) {
      logger.warn(`MongoDB connection failed. Retrying in ${RETRY_DELAY_MS}ms... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDatabase(retries - 1);
    }

    logger.error('MongoDB connection failed after all retries', { error });
    throw error;
  }
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
