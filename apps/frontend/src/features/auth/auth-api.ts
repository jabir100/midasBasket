import { apiClient } from "../../shared/http/api-client.js";

const accessTokenStorageKey = "midas_access_token";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AuthPayload = {
  user: AuthUser;
  accessToken: string;
};

type ApiSuccess<TData> = {
  success: true;
  data: TData;
  requestId: string;
};

apiClient.interceptors.request.use((config) => {
  const token = getStoredAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function registerCustomer(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthPayload> {
  const response = await apiClient.post<ApiSuccess<AuthPayload>>(
    "/auth/register",
    input,
  );
  storeAccessToken(response.data.data.accessToken);
  return response.data.data;
}

export async function loginCustomer(input: {
  email: string;
  password: string;
}): Promise<AuthPayload> {
  const response = await apiClient.post<ApiSuccess<AuthPayload>>(
    "/auth/login",
    input,
  );
  storeAccessToken(response.data.data.accessToken);
  return response.data.data;
}

export async function logoutCustomer(): Promise<void> {
  await apiClient.post("/auth/logout");
  clearStoredAccessToken();
}

export async function requestPasswordReset(email: string): Promise<void> {
  await apiClient.post("/auth/forgot-password", { email });
}

export async function resetPassword(input: {
  token: string;
  password: string;
}): Promise<void> {
  await apiClient.post("/auth/reset-password", input);
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response =
    await apiClient.get<ApiSuccess<{ user: AuthUser }>>("/auth/me");
  return response.data.data.user;
}

export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(accessTokenStorageKey);
}

function storeAccessToken(token: string): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(accessTokenStorageKey, token);
  }
}

function clearStoredAccessToken(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(accessTokenStorageKey);
  }
}
