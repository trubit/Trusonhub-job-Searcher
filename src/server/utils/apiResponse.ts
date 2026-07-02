import { Response } from 'express';

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  [key: string]: unknown;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: ApiMeta;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
    stack?: string;
  };
  timestamp: string;
}

/**
 * Send a standardized success response.
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  options: {
    statusCode?: number;
    message?: string;
    meta?: ApiMeta;
  } = {},
): void {
  const { statusCode = 200, message, meta } = options;

  const body: SuccessResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };

  if (message) body.message = message;
  if (meta) body.meta = meta;

  res.status(statusCode).json(body);
}

/**
 * Send a standardized error response.
 */
export function sendError(
  res: Response,
  options: {
    statusCode?: number;
    code?: string;
    message?: string;
    fields?: Record<string, string[]>;
    stack?: string;
  } = {},
): void {
  const {
    statusCode = 500,
    code = 'INTERNAL_ERROR',
    message = 'An unexpected error occurred',
    fields,
    stack,
  } = options;

  const body: ErrorResponse = {
    success: false,
    error: { code, message },
    timestamp: new Date().toISOString(),
  };

  if (fields) body.error.fields = fields;
  if (stack && process.env.APP_ENV === 'development') body.error.stack = stack;

  res.status(statusCode).json(body);
}
