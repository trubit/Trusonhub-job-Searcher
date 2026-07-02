/**
 * Shared API response envelope types.
 * Used by both client (Axios responses) and server (apiResponse.ts).
 */

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
  meta?: ApiMeta;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
    stack?: string;
  };
  timestamp: string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  [key: string]: unknown;
}
