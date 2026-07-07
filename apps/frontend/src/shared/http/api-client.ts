import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { frontendEnv } from "../config/env.js";

const accessTokenStorageKey = "midas_access_token";

type ApiSuccess<TData> = {
  success: true;
  data: TData;
  requestId: string;
};

type AuthPayload = {
  accessToken: string;
};

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const apiClient = axios.create({
  baseURL: frontendEnv.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

let refreshRequest: Promise<string> | null = null;

apiClient.interceptors.request.use((config) => {
  const token = getStoredAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const responseStatus = error.response?.status;
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (!originalRequest || responseStatus !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? "";
    if (isAuthEndpoint(requestUrl)) {
      clearStoredAccessToken();
      redirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const accessToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return await apiClient(originalRequest);
    } catch (refreshError) {
      clearStoredAccessToken();
      redirectToLogin();
      return Promise.reject(toError(refreshError));
    }
  },
);

export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(accessTokenStorageKey);
}

export function storeAccessToken(token: string): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(accessTokenStorageKey, token);
  }
}

export function clearStoredAccessToken(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(accessTokenStorageKey);
  }
}

async function refreshAccessToken(): Promise<string> {
  refreshRequest ??= requestNewAccessToken().finally(() => {
    refreshRequest = null;
  });

  return refreshRequest;
}

async function requestNewAccessToken(): Promise<string> {
  const response = await axios.post<ApiSuccess<AuthPayload>>(
    `${frontendEnv.VITE_API_BASE_URL}/auth/refresh`,
    undefined,
    { withCredentials: true, headers: { Accept: "application/json" } },
  );
  const accessToken = response.data.data.accessToken;
  storeAccessToken(accessToken);
  return accessToken;
}

function isAuthEndpoint(url: string): boolean {
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/refresh")
  );
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error("Session refresh failed");
}

function redirectToLogin(): void {
  if (typeof window === "undefined") {
    return;
  }

  const currentPath = window.location.pathname;
  if (currentPath !== "/login") {
    window.location.assign("/login");
  }
}
