import axios, { AxiosError, AxiosResponse } from 'axios';
import { jwtService } from './jwt';
import { authSliceActions } from '@/features/auth/authSlice';
import { store } from '@/app/store';

const http = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use(
  (config) => {
    const token = jwtService.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (import.meta.env.DEV) {
      console.log(`[HTTP] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// This is what was missing — without this, responses are silent on errors
// and you get no visibility into what Spring Boot is actually returning

http.interceptors.response.use(
  (response: AxiosResponse) => {
    // Logs every successful response so it shows up in your console
    if (import.meta.env.DEV) {
      console.log(
        `[HTTP] ${response.status} ${response.config.url}`,
        response.data
      );
    }

    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const url    = error.config?.url;
    const data   = error.response?.data;

    if (import.meta.env.DEV) {
      console.error(`[HTTP] Error ${status} on ${url}`, data);
    }

    // ── Handle common Spring Boot HTTP error codes ─────────────────────────
    switch (status) {
      case 400:
        // Spring Boot validation errors come back as { message: "..." }
        // The epic's catchError will pick this up via error.response.data.message
        break;

      case 401:
        // Token expired or invalid — clear it and let the app redirect to login
        jwtService.removeToken();
        store.dispatch(authSliceActions.logoutSuccess());
        break;

      case 409:
        // Email/username already exists — Spring Boot typically returns 409 Conflict
        break;

      case 500:
        console.error('[HTTP] Server error — check your Spring Boot logs');
        break;
    }

    // Always re-reject so the epic's catchError still receives it
    return Promise.reject(error);
  }
);

export default http;
