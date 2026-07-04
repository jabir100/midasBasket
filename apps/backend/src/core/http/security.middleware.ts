import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import helmet from "helmet";
import cors, { type CorsOptions } from "cors";
import type { RequestHandler } from "express";

import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";

const corsOptions: CorsOptions = {
  credentials: true,
  origin(
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void,
  ) {
    if (!origin || env.CLIENT_ORIGINS.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(
      new AppError({
        statusCode: 403,
        code: "CORS_ORIGIN_DENIED",
        message: "Origin is not allowed",
      }),
    );
  },
};

const contentSecurityPolicy = {
  directives: {
    defaultSrc: ["'self'"],
    baseUri: ["'self'"],
    connectSrc: ["'self'", ...env.CLIENT_ORIGINS],
    frameAncestors: ["'none'"],
    imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
    objectSrc: ["'none'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    upgradeInsecureRequests: env.NODE_ENV === "production" ? [] : null,
  },
};

export const securityMiddleware: RequestHandler[] = [
  helmet({
    contentSecurityPolicy,
    crossOriginEmbedderPolicy: false,
    hsts:
      env.NODE_ENV === "production"
        ? { maxAge: 31_536_000, includeSubDomains: true, preload: true }
        : false,
  }),
  cors(corsOptions),
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
  slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 100,
    delayMs: () => 250,
  }),
  mongoSanitize({ replaceWith: "_" }),
];
