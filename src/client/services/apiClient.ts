import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../features/auth/store/useAuthStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true, // Send/receive HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Endpoints that are strictly public and should NEVER send Authorization headers
const PURELY_PUBLIC_PATTERNS = [
  '/stats/public',
  '/jobs/search',
  '/job-categories',
  '/job-locations',
  '/job-types',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/resend-verification',
];

const isPurelyPublicEndpoint = (url?: string) => {
  if (!url) return false;
  // Strictly protected prefixes — ALWAYS send Authorization headers
  if (
    url.includes('/my/') ||
    url.includes('/me') ||
    url.includes('/employer') ||
    url.includes('/admin') ||
    url.includes('/applications') ||
    url.includes('/bookmarks') ||
    url.includes('/interviews') ||
    url.includes('/offers') ||
    url.includes('/hiring')
  ) {
    return false;
  }
  // Exact path or query string matching for purely public endpoints
  return PURELY_PUBLIC_PATTERNS.some((pattern) => url === pattern || url.startsWith(`${pattern}?`));
};

// Request Interceptor: Attach Access Token ONLY to protected endpoints
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken && config.headers && !isPurelyPublicEndpoint(config.url)) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Silent Token Refresh ONLY for protected routes
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const url = originalRequest.url || '';

    // If request is purely public, reject cleanly without triggering token refresh
    if (isPurelyPublicEndpoint(url)) {
      return Promise.reject(error);
    }

    // Handle 401 on protected routes via silent token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${API_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken, user } = response.data.data;
        useAuthStore.getState().setAuth(user, accessToken);

        processQueue(null, accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
