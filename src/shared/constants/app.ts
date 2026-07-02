/**
 * Application-wide constants shared by client and server.
 */

export const APP = {
  NAME: 'TrusonHub Job Searcher',
  VERSION: '1.0.0',
  DESCRIPTION: 'Enterprise job board platform',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const AUTH = {
  ACCESS_TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  TOKEN_TYPE: 'Bearer',
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const,
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'] as const,
} as const;

export const QUERY_KEYS = {
  HEALTH: ['health'] as const,
  JOBS: ['jobs'] as const,
  JOB: (id: string) => ['jobs', id] as const,
  COMPANIES: ['companies'] as const,
  COMPANY: (id: string) => ['companies', id] as const,
  PROFILE: ['profile'] as const,
} as const;
