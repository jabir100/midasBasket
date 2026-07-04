import { ZodError } from "zod";
import type { ErrorRequestHandler } from "express";

import { env } from "../config/env.js";
import { getRequestId } from "../http/request-id.middleware.js";
import { sendError } from "../http/send-response.js";
import { logger } from "../logging/logger.js";
import { AppError } from "./app-error.js";

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  _next,
) => {
  const requestId = getRequestId(res);

  if (error instanceof AppError) {
    sendError(res, {
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
      details: error.details,
      requestId,
    });
    return;
  }

  if (error instanceof ZodError) {
    sendError(res, {
      statusCode: 422,
      code: "VALIDATION_ERROR",
      message: "Request validation failed",
      details: error.flatten(),
      requestId,
    });
    return;
  }

  logger.error({ error, requestId }, "Unhandled application error");

  sendError(res, {
    statusCode: 500,
    code: "INTERNAL_SERVER_ERROR",
    message:
      env.NODE_ENV === "production"
        ? "Internal server error"
        : "Unexpected server error",
    requestId,
  });
};
