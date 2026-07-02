import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, ValidationError } from '../utils/AppError.js';
import { sendError } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

/**
 * 404 handler — must be registered after all routes.
 */
export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, {
    statusCode: 404,
    code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
}

/**
 * Global error handler — must be registered after notFoundHandler.
 * Catches all errors thrown from route handlers and middleware.
 */
export function globalErrorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Already-formatted operational errors
  if (error instanceof AppError) {
    if (!error.isOperational) {
      logger.error('Non-operational AppError', { error });
    }

    const extra =
      error instanceof ValidationError ? { fields: error.fields } : {};

    sendError(res, {
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
      stack: env.APP_ENV === 'development' ? error.stack : undefined,
      ...extra,
    });
    return;
  }

  // Zod validation errors (from request body parsing)
  if (error instanceof ZodError) {
    const fields: Record<string, string[]> = {};
    for (const issue of error.issues) {
      const path = issue.path.join('.');
      if (!fields[path]) fields[path] = [];
      fields[path].push(issue.message);
    }

    sendError(res, {
      statusCode: 422,
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      fields,
    });
    return;
  }

  // Mongoose duplicate key error
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: unknown }).code === 11000
  ) {
    sendError(res, {
      statusCode: 409,
      code: 'CONFLICT_ERROR',
      message: 'A record with this value already exists',
    });
    return;
  }

  // Unknown errors — log and return generic 500
  logger.error('Unhandled error', { error });

  sendError(res, {
    statusCode: 500,
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    stack:
      env.APP_ENV === 'development' && error instanceof Error
        ? error.stack
        : undefined,
  });
}
