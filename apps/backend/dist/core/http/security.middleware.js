import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import helmet from "helmet";
import cors from "cors";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
const corsOptions = {
    credentials: true,
    origin(origin, callback) {
        if (!origin || env.CLIENT_ORIGINS.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new AppError({
            statusCode: 403,
            code: "CORS_ORIGIN_DENIED",
            message: "Origin is not allowed",
        }));
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
function sanitizeKey(key) {
    return key.replace(/[$.]/g, "_");
}
function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function sanitizeValue(value) {
    if (Array.isArray(value)) {
        for (const item of value) {
            sanitizeValue(item);
        }
        return;
    }
    if (!isRecord(value)) {
        return;
    }
    for (const key of Object.keys(value)) {
        const sanitizedKey = sanitizeKey(key);
        const nestedValue = value[key];
        if (sanitizedKey !== key) {
            Reflect.deleteProperty(value, key);
            value[sanitizedKey] = nestedValue;
        }
        sanitizeValue(nestedValue);
    }
}
const mongoSanitizeMiddleware = (req, _res, next) => {
    sanitizeValue(req.body);
    sanitizeValue(req.params);
    sanitizeValue(req.query);
    next();
};
export const securityMiddleware = [
    helmet({
        contentSecurityPolicy,
        crossOriginEmbedderPolicy: false,
        hsts: env.NODE_ENV === "production"
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
    mongoSanitizeMiddleware,
];
//# sourceMappingURL=security.middleware.js.map