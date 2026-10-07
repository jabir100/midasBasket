import compression from "compression";
import cookieParser from "cookie-parser";
import express, { type Express, type RequestHandler } from "express";

import { env } from "./core/config/env.js";
import { AppError } from "./core/errors/app-error.js";
import { errorHandler } from "./core/errors/error-handler.js";
import { notFoundHandler } from "./core/errors/not-found-handler.js";
import { requestIdMiddleware } from "./core/http/request-id.middleware.js";
import { securityMiddleware } from "./core/http/security.middleware.js";
import { httpLogger } from "./core/logging/http-logger.js";
import { logger } from "./core/logging/logger.js";
import { apiRouter } from "./routes/api.router.js";

export type CreateAppOptions = {
  /*
   * Awaited before every API request. Serverless entrypoints use it to open
   * connections lazily; long-running servers connect once at boot instead.
   */
  ensureConnections?: () => Promise<void>;
};

function createConnectionGate(
  ensureConnections: () => Promise<void>,
): RequestHandler {
  return (_req, res, next) => {
    ensureConnections().then(
      () => {
        next();
      },
      (error: unknown) => {
        logger.error({ error }, "Backend dependencies are unavailable");
        res.setHeader("Retry-After", "2");
        next(
          new AppError({
            statusCode: 503,
            code: "SERVICE_UNAVAILABLE",
            message: "Service is temporarily unavailable. Please try again.",
          }),
        );
      },
    );
  };
}

export function createApp(options: CreateAppOptions = {}): Express {
  const app = express();

  app.set("trust proxy", env.NODE_ENV === "production" ? 1 : false);

  app.use(requestIdMiddleware);
  app.use(httpLogger);
  app.use(securityMiddleware);
  app.use(
    compression({
      level: 6,
      threshold: 1024,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false, limit: "1mb" }));
  app.use(cookieParser());

  app.use(env.API_BASE_PATH, (_req, res, next) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    next();
  });
  if (options.ensureConnections) {
    app.use(env.API_BASE_PATH, createConnectionGate(options.ensureConnections));
  }
  app.use(env.API_BASE_PATH, apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
