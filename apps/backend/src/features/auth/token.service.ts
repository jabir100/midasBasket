import { SignJWT, jwtVerify } from "jose";

import { env } from "../../core/config/env.js";
import type { AuthenticatedPrincipal, UserRole } from "./auth.types.js";

export type AuthTokenKind = "access" | "refresh";

export type AuthTokenPayload = AuthenticatedPrincipal & {
  kind: AuthTokenKind;
};

const encoder = new TextEncoder();
const accessSecret = encoder.encode(env.JWT_ACCESS_SECRET);
const refreshSecret = encoder.encode(env.JWT_REFRESH_SECRET);

export async function issueAccessToken(
  principal: AuthenticatedPrincipal,
): Promise<string> {
  return issueToken(
    principal,
    "access",
    env.JWT_ACCESS_TOKEN_TTL_SECONDS,
    accessSecret,
  );
}

export async function issueRefreshToken(
  principal: AuthenticatedPrincipal,
): Promise<string> {
  return issueToken(
    principal,
    "refresh",
    env.JWT_REFRESH_TOKEN_TTL_SECONDS,
    refreshSecret,
  );
}

export async function verifyAccessToken(
  token: string,
): Promise<AuthTokenPayload> {
  return verifyToken(token, "access", accessSecret);
}

export async function verifyRefreshToken(
  token: string,
): Promise<AuthTokenPayload> {
  return verifyToken(token, "refresh", refreshSecret);
}

async function issueToken(
  principal: AuthenticatedPrincipal,
  kind: AuthTokenKind,
  ttlSeconds: number,
  secret: Uint8Array,
): Promise<string> {
  return new SignJWT({
    role: principal.role,
    sessionId: principal.sessionId,
    kind,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(principal.userId)
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds.toString()}s`)
    .sign(secret);
}

async function verifyToken(
  token: string,
  expectedKind: AuthTokenKind,
  secret: Uint8Array,
): Promise<AuthTokenPayload> {
  const { payload } = await jwtVerify(token, secret);

  if (
    payload.kind !== expectedKind ||
    typeof payload.sub !== "string" ||
    typeof payload.sessionId !== "string" ||
    !isUserRole(payload.role)
  ) {
    throw new Error("Invalid token payload");
  }

  return {
    userId: payload.sub,
    role: payload.role,
    sessionId: payload.sessionId,
    kind: expectedKind,
  };
}

function isUserRole(value: unknown): value is UserRole {
  return value === "admin" || value === "customer";
}
