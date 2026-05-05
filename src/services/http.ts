import axios from 'axios';

import { authSliceActions } from '../features/auth/authSlice';
import { jwtService } from './jwt';

import type { AppDispatch } from '../app/store';
import type { AxiosError, AxiosResponse } from 'axios';

// Injected by store.ts after the store is created to avoid a circular import:
// http → store → rootEpic → authSlice → http
let _dispatch: AppDispatch | undefined;
export const injectStore = (dispatch: AppDispatch) => { _dispatch = dispatch; };

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

    // if (import.meta.env.DEV) {
    //   console.log(`[HTTP] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
    //     headers: config.headers,
    //     data: config.data,
    //   });
    // }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

http.interceptors.response.use(
  (response: AxiosResponse) => {
    // if (import.meta.env.DEV) {
    //   console.log(
    //     `[HTTP] ${response.status} ${response.config.url}`,
    //     response.data
    //   );
    // }

    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;

    // if (import.meta.env.DEV) {
    //   console.error(`[HTTP] Error ${status} on ${url}`, data);
    // }

    switch (status) {
      case 400:
        break;

      case 401:
        jwtService.removeToken();
        _dispatch?.(authSliceActions.logoutSuccess());
        break;

      case 409:
        break;

      case 500:
        console.error('[HTTP] Server error — check your Spring Boot logs');
        break;
    }

    return Promise.reject(error);
  }
);

export default http;
