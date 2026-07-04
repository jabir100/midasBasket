import type { RequestHandler, Response } from "express";

import { AppError } from "../../core/errors/app-error.js";
import type { AuthenticatedPrincipal, UserRole } from "./auth.types.js";

const principalKey = "principal";

export function setPrincipal(
  res: Response,
  principal: AuthenticatedPrincipal,
): void {
  res.locals[principalKey] = principal;
}

export function getPrincipal(res: Response): AuthenticatedPrincipal | null {
  const locals = res.locals as Record<string, unknown>;
  const principal = locals[principalKey];

  if (!isAuthenticatedPrincipal(principal)) {
    return null;
  }

  return principal;
}

export function requireRoles(
  allowedRoles: readonly UserRole[],
): RequestHandler {
  return (_req, res, next) => {
    const principal = getPrincipal(res);

    if (!principal) {
      next(
        new AppError({
          statusCode: 401,
          code: "AUTHENTICATION_REQUIRED",
          message: "Authentication is required",
        }),
      );
      return;
    }

    if (!allowedRoles.includes(principal.role)) {
      next(
        new AppError({
          statusCode: 403,
          code: "INSUFFICIENT_PERMISSIONS",
          message: "Insufficient permissions",
        }),
      );
      return;
    }

    next();
  };
}

function isAuthenticatedPrincipal(
  value: unknown,
): value is AuthenticatedPrincipal {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<AuthenticatedPrincipal>;

  return (
    typeof candidate.userId === "string" &&
    typeof candidate.sessionId === "string" &&
    (candidate.role === "admin" || candidate.role === "customer")
  );
}
