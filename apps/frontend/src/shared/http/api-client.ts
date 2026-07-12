import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { frontendEnv } from "../config/env.js";

const accessTokenStorageKey = "midas_access_token";

type ApiSuccess<TData> = {
  success: true;
  data: TData;
  requestId: string;
};

type ApiErrorBody = {
  code?: string;
  message?: string;
  details?: unknown;
};

type ApiErrorResponse = {
  success: false;
  error?: ApiErrorBody;
  message?: string;
  details?: unknown;
  requestId?: string;
};

type ValidationDetails = {
  fieldErrors?: Record<string, readonly string[] | undefined>;
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
      return Promise.reject(normalizeApiError(error));
    }

    const requestUrl = originalRequest.url ?? "";
    if (isAuthEndpoint(requestUrl)) {
      if (requestUrl.includes("/auth/refresh")) {
        clearStoredAccessToken();
        redirectToLogin();
      }

      clearStoredAccessToken();
      return Promise.reject(normalizeApiError(error));
    }

    originalRequest._retry = true;

    try {
      const accessToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return await apiClient(originalRequest);
    } catch (refreshError) {
      clearStoredAccessToken();
      redirectToLogin();
      return Promise.reject(normalizeApiError(refreshError));
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

function normalizeApiError(error: unknown): Error {
  if (!axios.isAxiosError(error)) {
    return toError(error);
  }

  const responseData = error.response?.data as ApiErrorResponse | undefined;
  const apiMessage = responseData?.error?.message ?? responseData?.message;
  const apiCode = responseData?.error?.code;
  const validationDetails = responseData?.error?.details as
    ValidationDetails | undefined;

  if (apiMessage) {
    return new Error(
      formatReadableMessage(apiCode, apiMessage, validationDetails),
    );
  }

  if (apiCode === "VALIDATION_ERROR") {
    return new Error("Please fix the highlighted fields.");
  }

  if (apiCode === "DUPLICATE_KEY_ERROR") {
    return new Error("This value already exists. Please use a different one.");
  }

  if (error.response?.status === 401) {
    return new Error("Your session expired. Please log in again.");
  }

  if (error.response?.status === 403) {
    return new Error("You do not have permission to perform this action.");
  }

  if (error.response?.status === 404) {
    return new Error("The requested item was not found.");
  }

  if (error.response?.status === 409) {
    return new Error("This item already exists.");
  }

  if (error.response?.status === 422) {
    return new Error("Please check the form values and try again.");
  }

  return new Error(error.message || "Something went wrong. Please try again.");
}

function formatReadableMessage(
  apiCode: string | undefined,
  apiMessage: string,
  validationDetails?: ValidationDetails,
): string {
  if (apiCode === "VALIDATION_ERROR" && validationDetails?.fieldErrors) {
    const fieldMessages = Object.entries(validationDetails.fieldErrors)
      .map(([field, messages]) => {
        const fieldLabel = formatFieldLabel(field);
        const firstMessage = messages?.find(
          (message) => message.trim().length > 0,
        );

        if (!firstMessage) {
          return null;
        }

        return `${fieldLabel} ${simplifyValidationMessage(firstMessage)}`;
      })
      .filter((message): message is string => message !== null);

    if (fieldMessages.length > 0) {
      return fieldMessages.join(". ");
    }
  }

  if (apiCode === "DUPLICATE_KEY_ERROR") {
    return "This value already exists. Please use a different one.";
  }

  return apiMessage;
}

function formatFieldLabel(field: string): string {
  const label = field
    .replace(/[._-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();

  return label.charAt(0).toUpperCase() + label.slice(1);
}

function simplifyValidationMessage(message: string): string {
  const normalized = message.trim().replace(/\.$/, "");

  if (/at least \d+ character\(s\)/i.test(normalized)) {
    const match = /at least (\d+) character\(s\)/i.exec(normalized);
    const minimumLength = match ? match[1] : undefined;
    return minimumLength
      ? `contain at least ${minimumLength} characters`
      : normalized;
  }

  if (/invalid/i.test(normalized)) {
    return "is invalid.";
  }

  return `${normalized.toLowerCase().replace(/\s*\.$/, "")}.`;
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
