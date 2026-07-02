import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

/**
 * Axios instance pre-configured for the TrusonHub API.
 * - Base URL from environment variable
 * - 10s timeout
 * - JSON content-type
 * - Auth header injection via request interceptor
 * - Automatic token refresh stub (Phase 2)
 */
export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// ── Request interceptor — inject access token ─────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ── Response interceptor — handle 401 / token refresh ────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Phase 2: implement token refresh here
      // const newToken = await refreshAccessToken();
      // originalRequest.headers.Authorization = `Bearer ${newToken}`;
      // return apiClient(originalRequest);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
