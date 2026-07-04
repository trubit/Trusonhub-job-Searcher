import 'dotenv/config';
import http from 'node:http';
import { env } from './config/env.js';
import { createApp } from './config/app.js';
import { connectDatabase, disconnectDatabase } from './database/connection.js';
import { logger } from './utils/logger.js';

const app = createApp();
const server = http.createServer(app);

/**
 * Graceful shutdown handler.
 * Closes the HTTP server, then disconnects from MongoDB.
 */
async function shutdown(signal: string): Promise<void> {
  logger.info(`\n${signal} received — shutting down gracefully...`);

  server.close(async (err) => {
    if (err) {
      logger.error('Error closing HTTP server', { err });
      process.exit(1);
    }

    try {
      await disconnectDatabase();
      logger.info('✅ Graceful shutdown complete');
      process.exit(0);
    } catch (error) {
      logger.error('Error during database disconnect', { error });
      process.exit(1);
    }
  });

  // Force exit if graceful shutdown takes too long
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10_000).unref();
}

/**
 * Bootstrap the server.
 */
async function bootstrap(): Promise<void> {
  try {
    logger.info(`🚀 Starting ${env.APP_NAME} [${env.APP_ENV}]`);

    // Connect to database
    await connectDatabase();

    // Seed default data
    const { seedDatabase } = await import('./database/seed.js');
    await seedDatabase();

    // Start HTTP server
    server.listen(env.PORT, () => {
      logger.info(`✅ Server running on port ${env.PORT}`);
      logger.info(`   API: ${env.SERVER_URL}/api`);
      logger.info(`   Health: ${env.SERVER_URL}/api/health`);
    });

    // Handle graceful shutdown signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Promise Rejection', { reason, promise });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception — shutting down', { error });
      process.exit(1);
    });
  } catch (error) {
    logger.error('Fatal error during bootstrap', { error });
    process.exit(1);
  }
}

bootstrap();
