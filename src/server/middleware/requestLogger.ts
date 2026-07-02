import morgan from 'morgan';
import { RequestHandler } from 'express';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

/**
 * HTTP request logger using Morgan streamed through Winston.
 * Dev: concise colored output
 * Prod: combined Apache format → JSON via Winston stream
 */
export function createRequestLogger(): RequestHandler {
  const format = env.APP_ENV === 'development' ? 'dev' : 'combined';

  return morgan(format, {
    stream: logger.stream as unknown as { write: (str: string) => void },
    skip: (_req, res) => {
      // In production, skip logging successful health-check requests
      if (env.APP_ENV === 'production' && res.statusCode < 400) {
        return _req.url === '/api/health';
      }
      return false;
    },
  });
}
