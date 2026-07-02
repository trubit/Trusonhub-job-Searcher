import { z } from 'zod';

/**
 * Environment variable schema — validated at server startup.
 * Any missing or malformed variable causes an immediate crash with a clear message.
 */
const envSchema = z.object({
  // Application
  APP_NAME: z.string().min(1).default('TrusonHub Job Searcher'),
  APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  SERVER_URL: z.string().url().default('http://localhost:5000'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('debug'),

  // Database
  MONGODB_URI: z.string().min(1),
  MONGODB_DB_NAME: z.string().min(1).default('trusonhub_dev'),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Redis
  REDIS_URL: z.string().url().default('redis://localhost:6379'),

  // Cloudinary (optional in dev)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // SMTP (optional in dev)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `  ✗ ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    console.error('\n❌ Environment validation failed:\n' + errors + '\n');
    process.exit(1);
  }

  return result.data;
}

export const env = validateEnv();
export const isDev = env.APP_ENV === 'development';
export const isProd = env.APP_ENV === 'production';
export const isStaging = env.APP_ENV === 'staging';
