import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import { createSecurityMiddleware } from '../middleware/security.js';
import { createRequestLogger } from '../middleware/requestLogger.js';
import { globalErrorHandler, notFoundHandler } from '../middleware/errorHandler.js';
import healthRouter from '../routes/health.js';
import authRouter from '../modules/auth/routes/auth.routes.js';

/**
 * Express application factory.
 * Creates and configures the Express app instance with all middleware and routes.
 * Does not start the HTTP server — that is done in index.ts.
 */
export function createApp(): Application {
  const app = express();

  // ── Request parsing ──────────────────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // ── HTTP Request logging ─────────────────────────────────────────────────
  app.use(createRequestLogger());

  // ── Security middleware (Helmet, CORS, Compression, Rate Limit) ──────────
  app.use(createSecurityMiddleware());

  // ── API Routes ───────────────────────────────────────────────────────────
  app.use('/api/health', healthRouter);
  app.use('/api/v1/auth', authRouter);

  // ── 404 → must come after all routes ────────────────────────────────────
  app.use(notFoundHandler);

  // ── Global error handler → must be last ─────────────────────────────────
  app.use(globalErrorHandler);

  return app;
}
