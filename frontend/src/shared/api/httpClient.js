import axios from "axios";
import { clearToken, getTokenRevision, loadToken, saveToken } from "./tokenStorage.js";

const rawBaseUrl = import.meta.env?.VITE_API_BASE_URL || "http://localhost:8080";
const normalizedBaseUrl = rawBaseUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");

const clientOptions = {
  baseURL: normalizedBaseUrl || "http://localhost:8080",
  withCredentials: true,
};

export const httpClient = axios.create(clientOptions);
const refreshClient = axios.create(clientOptions);
let refreshPromise = null;

export function refreshSession() {
  if (!refreshPromise) {
    const originalToken = loadToken();
    const originalRevision = getTokenRevision();
    refreshPromise = refreshClient.post("/api/auth/refresh").then(({ data }) => {
      if (getTokenRevision() !== originalRevision || loadToken() !== originalToken) {
        throw new Error("Phiên đăng nhập đã thay đổi.");
      }
      if (!data?.token || !data?.user) throw new Error("Không thể gia hạn phiên đăng nhập.");
      saveToken(data.token);
      return data;
    }).finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

httpClient.interceptors.request.use((config) => {
  const token = loadToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

httpClient.interceptors.response.use((response) => response, async (error) => {
  const request = error.config;
  if (error.response?.status !== 401 || !request || request._retried ||
      request.url?.startsWith("/api/auth/")) throw error;
  request._retried = true;
  const currentToken = loadToken();
  if (!currentToken || request.headers.Authorization === `Bearer ${currentToken}`) {
    try {
      await refreshSession();
    } catch (refreshErr) {
      clearToken();
      throw refreshErr;
    }
  }
  return httpClient(request);
});
