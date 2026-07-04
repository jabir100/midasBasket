import { createHash, randomBytes } from "node:crypto";
import { Types } from "mongoose";

import { env } from "../../core/config/env.js";
import { AppError } from "../../core/errors/app-error.js";
import { UserModel } from "../users/user.model.js";
import { createRefreshTokenCookieOptions } from "./auth-cookie.js";
import { AuthSessionModel } from "./auth-session.model.js";
import type { AuthenticatedPrincipal } from "./auth.types.js";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "./auth.schemas.js";
import { PasswordResetTokenModel } from "./password-reset-token.model.js";
import { hashPassword, verifyPassword } from "./password.service.js";
import {
  issueAccessToken,
  issueRefreshToken,
  verifyRefreshToken,
} from "./token.service.js";

export type AuthUserDto = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AuthResult = {
  user: AuthUserDto;
  accessToken: string;
  refreshToken: string;
};

export async function registerCustomer(
  input: RegisterInput,
): Promise<AuthResult> {
  const existingUser = await UserModel.exists({ email: input.email });

  if (existingUser) {
    throw new AppError({
      statusCode: 409,
      code: "EMAIL_ALREADY_REGISTERED",
      message: "An account already exists for this email",
    });
  }

  const user = await UserModel.create({
    name: input.name,
    email: input.email,
    passwordHash: await hashPassword(input.password),
    role: "customer",
  });

  return createAuthResult({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  });
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const user = await UserModel.findOne({ email: input.email }).select(
    "+passwordHash",
  );

  if (user?.status !== "active") {
    throw invalidCredentialsError();
  }

  const passwordMatches = await verifyPassword(
    user.passwordHash,
    input.password,
  );

  if (!passwordMatches) {
    throw invalidCredentialsError();
  }

  return createAuthResult({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  });
}

export async function rotateRefreshToken(
  refreshToken: string,
): Promise<AuthResult> {
  const payload = await verifyRefreshToken(refreshToken);
  const tokenHash = hashToken(refreshToken);
  const session = await AuthSessionModel.findOne({
    _id: payload.sessionId,
    tokenHash,
    revokedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  });

  if (!session) {
    throw new AppError({
      statusCode: 401,
      code: "INVALID_REFRESH_TOKEN",
      message: "Refresh token is invalid or expired",
    });
  }

  const user = await UserModel.findById(payload.userId);

  if (user?.status !== "active") {
    throw new AppError({
      statusCode: 401,
      code: "SESSION_USER_UNAVAILABLE",
      message: "The session user is unavailable",
    });
  }

  const result = await createAuthResult({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  });

  session.revokedAt = new Date();
  session.replacedBySessionId = new Types.ObjectId(result.principal.sessionId);
  await session.save();

  return result;
}

export async function revokeRefreshToken(
  refreshToken: string | null,
): Promise<void> {
  if (!refreshToken) {
    return;
  }

  await AuthSessionModel.updateOne(
    { tokenHash: hashToken(refreshToken), revokedAt: { $exists: false } },
    { $set: { revokedAt: new Date() } },
  );
}

export async function getCurrentUser(
  principal: AuthenticatedPrincipal,
): Promise<AuthUserDto> {
  const user = await UserModel.findById(principal.userId);

  if (user?.status !== "active") {
    throw new AppError({
      statusCode: 404,
      code: "USER_NOT_FOUND",
      message: "User was not found",
    });
  }

  return toUserDto(user);
}

export async function createPasswordReset(
  input: ForgotPasswordInput,
): Promise<{ resetToken?: string }> {
  const user = await UserModel.findOne({
    email: input.email,
    status: "active",
  });

  if (!user) {
    return {};
  }

  const resetToken = randomBytes(32).toString("hex");
  await PasswordResetTokenModel.create({
    userId: user._id,
    tokenHash: hashToken(resetToken),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });

  return env.NODE_ENV === "production" ? {} : { resetToken };
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  const resetToken = await PasswordResetTokenModel.findOne({
    tokenHash: hashToken(input.token),
    consumedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  });

  if (!resetToken) {
    throw new AppError({
      statusCode: 400,
      code: "INVALID_PASSWORD_RESET_TOKEN",
      message: "Password reset token is invalid or expired",
    });
  }

  await UserModel.updateOne(
    { _id: resetToken.userId },
    { $set: { passwordHash: await hashPassword(input.password) } },
  );
  resetToken.consumedAt = new Date();
  await resetToken.save();
  await AuthSessionModel.updateMany(
    { userId: resetToken.userId, revokedAt: { $exists: false } },
    { $set: { revokedAt: new Date() } },
  );
}

export function getRefreshCookieOptions(): ReturnType<
  typeof createRefreshTokenCookieOptions
> {
  return createRefreshTokenCookieOptions();
}

async function createAuthResult(
  user: AuthUserDto,
): Promise<AuthResult & { principal: AuthenticatedPrincipal }> {
  const sessionId = new Types.ObjectId();
  const principal: AuthenticatedPrincipal = {
    userId: user.id,
    role: user.role === "admin" ? "admin" : "customer",
    sessionId: sessionId.toString(),
  };
  const accessToken = await issueAccessToken(principal);
  const refreshToken = await issueRefreshToken(principal);

  await AuthSessionModel.create({
    _id: sessionId,
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + env.JWT_REFRESH_TOKEN_TTL_SECONDS * 1000),
  });

  return { user, accessToken, refreshToken, principal };
}

function toUserDto(user: {
  _id: unknown;
  name: string;
  email: string;
  role: string;
}): AuthUserDto {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function invalidCredentialsError(): AppError {
  return new AppError({
    statusCode: 401,
    code: "INVALID_CREDENTIALS",
    message: "Email or password is incorrect",
  });
}
