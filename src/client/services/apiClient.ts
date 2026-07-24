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

const PUBLIC_PATTERNS = [
  '/stats/public',
  '/jobs/search',
  '/job-categories',
  '/job-locations',
  '/job-types',
  '/company',
  '/auth/login',
  '/auth/register',
  '/auth/me',
  '/auth/refresh',
];

const isPublicEndpoint = (url?: string) => {
  if (!url) return false;
  return PUBLIC_PATTERNS.some((pattern) => url.includes(pattern));
};

// Request Interceptor: Attach Access Token from memory/persisted store
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Silent Token Refresh on 401 & Retry for Public Requests
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const url = originalRequest.url || '';

    // For public endpoints receiving 401 (e.g. invalid/expired token attached), retry once without Auth header
    if (error.response?.status === 401 && !originalRequest._retry && isPublicEndpoint(url)) {
      originalRequest._retry = true;
      if (originalRequest.headers) {
        delete originalRequest.headers.Authorization;
      }
      return apiClient(originalRequest);
    }

    // Skip silent refresh for auth & public endpoints to avoid infinite loops or unnecessary errors
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isPublicEndpoint(url)
    ) {
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
