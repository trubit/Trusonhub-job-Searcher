import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { RequestHandler } from 'express';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

/**
 * Helmet — sets security-related HTTP headers.
 */
export const helmetMiddleware = helmet({
  crossOriginEmbedderPolicy: false, // Required for some CDN assets in dev
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow cross-origin resource downloads
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com', 'https://images.unsplash.com', 'https:'],
      mediaSrc: ["'self'", 'https://res.cloudinary.com', 'blob:'],
      frameSrc: ["'self'", 'https://res.cloudinary.com', 'https://www.w3.org'],
      objectSrc: ["'self'", 'https://res.cloudinary.com', 'https://www.w3.org'],
      connectSrc: ["'self'", env.CLIENT_URL, 'https://res.cloudinary.com', 'https://api.cloudinary.com', 'blob:'],
    },
  },
});

/**
 * CORS — allow requests only from the configured client origin.
 */
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    const allowedOrigins = env.CLIENT_URL.split(',').map((u) => u.trim());

    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-Total-Count', 'X-Request-ID'],
});

/**
 * Compression — gzip responses over 1KB.
 */
export const compressionMiddleware = compression({
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
});

/**
 * Global rate limiter — 100 requests per 15 minutes per IP.
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_ERROR',
      message: 'Too many requests, please try again later.',
    },
  },
  skip: () => env.APP_ENV === 'development',
});

/**
 * Strict rate limiter for auth routes — 10 requests per 15 minutes per IP.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_ERROR',
      message: 'Too many authentication attempts, please try again later.',
    },
  },
});

/**
 * Compose all security middleware into a single router.
 */
export function createSecurityMiddleware(): RequestHandler[] {
  return [helmetMiddleware, corsMiddleware, compressionMiddleware, globalRateLimiter];
}
