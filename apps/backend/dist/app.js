import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import { env } from "./core/config/env.js";
import { errorHandler } from "./core/errors/error-handler.js";
import { notFoundHandler } from "./core/errors/not-found-handler.js";
import { requestIdMiddleware } from "./core/http/request-id.middleware.js";
import { securityMiddleware } from "./core/http/security.middleware.js";
import { httpLogger } from "./core/logging/http-logger.js";
import { apiRouter } from "./routes/api.router.js";
export function createApp() {
    const app = express();
    app.set("trust proxy", env.NODE_ENV === "production" ? 1 : false);
    app.use(requestIdMiddleware);
    app.use(httpLogger);
    app.use(securityMiddleware);
    app.use(compression({
        level: 6,
        threshold: 1024,
    }));
    app.use(express.json({ limit: "1mb" }));
    app.use(express.urlencoded({ extended: false, limit: "1mb" }));
    app.use(cookieParser());
    app.use(env.API_BASE_PATH, (_req, res, next) => {
        res.setHeader("X-Robots-Tag", "noindex, nofollow");
        next();
    });
    app.use(env.API_BASE_PATH, apiRouter);
    app.use(notFoundHandler);
    app.use(errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map