import type { CookieOptions } from "express";

import { env } from "../../core/config/env.js";

export const refreshTokenCookieName = "midas_refresh_token";

export function createRefreshTokenCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    domain: env.COOKIE_DOMAIN,
    path: "/api/v1/auth/refresh",
    maxAge: env.JWT_REFRESH_TOKEN_TTL_SECONDS * 1000,
  };
}
