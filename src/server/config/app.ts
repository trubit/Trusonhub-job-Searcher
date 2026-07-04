import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import { createSecurityMiddleware } from '../middleware/security.js';
import { createRequestLogger } from '../middleware/requestLogger.js';
import { globalErrorHandler, notFoundHandler } from '../middleware/errorHandler.js';
import healthRouter from '../routes/health.js';
import authRouter from '../modules/auth/routes/auth.routes.js';
import profileRouter from '../modules/profile/routes/profile.routes.js';
import companyRouter from '../modules/company/routes/company.routes.js';
import resumeRouter from '../modules/resume/routes/resume.routes.js';
import mediaRouter from '../modules/media/routes/media.routes.js';
import categoryRouter from '../modules/job-category/routes/job-category.routes.js';
import jobTypeRouter from '../modules/job-type/routes/job-type.routes.js';
import jobLocationRouter from '../modules/job-location/routes/job-location.routes.js';
import jobRouter from '../modules/jobs/routes/job.routes.js';
import employerJobRouter from '../modules/jobs/routes/employer-job.routes.js';
import bookmarkRouter from '../modules/job-bookmark/routes/job-bookmark.routes.js';
import adminRouter from '../modules/admin/routes/admin.routes.js';
import applicationRouter from '../modules/application/routes/application.routes.js';
import statsRouter from '../routes/stats.js';

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
  app.use('/api/v1/profile', profileRouter);
  app.use('/api/v1/company', companyRouter);
  app.use('/api/v1/resume', resumeRouter);
  app.use('/api/v1/media', mediaRouter);
  app.use('/api/v1/job-categories', categoryRouter);
  app.use('/api/v1/job-types', jobTypeRouter);
  app.use('/api/v1/job-locations', jobLocationRouter);
  app.use('/api/v1/jobs', jobRouter);
  app.use('/api/v1/employer', employerJobRouter);
  app.use('/api/v1', bookmarkRouter);
  app.use('/api/v1/admin', adminRouter);
  app.use('/api/v1/applications', applicationRouter);
  app.use('/api/v1/stats', statsRouter);

  // ── 404 → must come after all routes ────────────────────────────────────
  app.use(notFoundHandler);

  // ── Global error handler → must be last ─────────────────────────────────
  app.use(globalErrorHandler);

  return app;
}
