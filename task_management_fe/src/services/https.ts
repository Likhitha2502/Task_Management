// src/services/http.ts
import axios from 'axios';
import { jwtService } from './jwt';

const http = axios.create({
  baseURL: 'http://localhost:8080/api', // Match your Spring Boot port
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR: Attaches the JWT to every single outgoing request
http.interceptors.request.use(
  (config) => {
    const token = jwtService.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
