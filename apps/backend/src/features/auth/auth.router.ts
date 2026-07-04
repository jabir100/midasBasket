import { Router, type Router as ExpressRouter } from "express";

import { getRequestId } from "../../core/http/request-id.middleware.js";
import { sendSuccess } from "../../core/http/send-response.js";
import { authenticateAccessToken } from "./authentication.middleware.js";
import { refreshTokenCookieName } from "./auth-cookie.js";
import {
  createPasswordReset,
  getCurrentUser,
  getRefreshCookieOptions,
  login,
  registerCustomer,
  resetPassword,
  revokeRefreshToken,
  rotateRefreshToken,
} from "./auth.service.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.schemas.js";
import { getPrincipal } from "./authorization.middleware.js";

export const authRouter: ExpressRouter = Router();

authRouter.post("/register", async (req, res, next) => {
  try {
    const result = await registerCustomer(registerSchema.parse(req.body));
    res.cookie(
      refreshTokenCookieName,
      result.refreshToken,
      getRefreshCookieOptions(),
    );
    sendSuccess(res, {
      statusCode: 201,
      data: { user: result.user, accessToken: result.accessToken },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const result = await login(loginSchema.parse(req.body));
    res.cookie(
      refreshTokenCookieName,
      result.refreshToken,
      getRefreshCookieOptions(),
    );
    sendSuccess(res, {
      data: { user: result.user, accessToken: result.accessToken },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/refresh", async (req, res, next) => {
  try {
    const refreshToken = getRefreshTokenCookie(req.cookies);
    const result = await rotateRefreshToken(refreshToken);
    res.cookie(
      refreshTokenCookieName,
      result.refreshToken,
      getRefreshCookieOptions(),
    );
    sendSuccess(res, {
      data: { user: result.user, accessToken: result.accessToken },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/logout", async (req, res, next) => {
  try {
    await revokeRefreshToken(getOptionalRefreshTokenCookie(req.cookies));
    res.clearCookie(refreshTokenCookieName, getRefreshCookieOptions());
    sendSuccess(res, {
      data: { loggedOut: true },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

authRouter.get("/me", authenticateAccessToken, async (_req, res, next) => {
  try {
    const principal = getPrincipal(res);
    if (!principal) {
      throw new Error("Missing authenticated principal");
    }
    sendSuccess(res, {
      data: { user: await getCurrentUser(principal) },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/forgot-password", async (req, res, next) => {
  try {
    const result = await createPasswordReset(
      forgotPasswordSchema.parse(req.body),
    );
    sendSuccess(res, {
      data: { accepted: true, ...result },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/reset-password", async (req, res, next) => {
  try {
    await resetPassword(resetPasswordSchema.parse(req.body));
    sendSuccess(res, {
      data: { passwordReset: true },
      requestId: getRequestId(res),
    });
  } catch (error) {
    next(error);
  }
});

function getRefreshTokenCookie(cookies: unknown): string {
  const token = getOptionalRefreshTokenCookie(cookies);
  if (!token) {
    throw new Error("Missing refresh token");
  }
  return token;
}

function getOptionalRefreshTokenCookie(cookies: unknown): string | null {
  if (!cookies || typeof cookies !== "object") {
    return null;
  }

  const token = (cookies as Record<string, unknown>)[refreshTokenCookieName];
  return typeof token === "string" ? token : null;
}
