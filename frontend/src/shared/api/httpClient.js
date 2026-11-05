import axios from "axios";
import { loadToken } from "./tokenStorage";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

httpClient.interceptors.request.use((config) => {
  const token = loadToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
