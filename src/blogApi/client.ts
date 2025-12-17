// src/api/client.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://blog.cadenabitcoin.dev",
  withCredentials: false,
});

// Simple in-memory token for now
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export default api;
