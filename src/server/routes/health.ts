import { Router, Request, Response } from 'express';
import { getDatabaseHealth } from '../database/connection.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { env } from '../config/env.js';

const router = Router();

/**
 * GET /api/health
 * Returns service health status including DB and basic uptime.
 */
router.get('/', async (_req: Request, res: Response) => {
  const db = getDatabaseHealth();

  const health = {
    status: 'ok' as const,
    app: env.APP_NAME,
    environment: env.APP_ENV,
    version: process.env.npm_package_version ?? '1.0.0',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    services: {
      database: {
        status: db.status,
        readyState: db.readyState,
      },
    },
  };

  sendSuccess(res, health, { message: 'Service is healthy' });
});

export default router;
