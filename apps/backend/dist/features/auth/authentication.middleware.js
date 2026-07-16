import { AppError } from "../../core/errors/app-error.js";
import { verifyAccessToken } from "./token.service.js";
import { setPrincipal } from "./authorization.middleware.js";
export const authenticateAccessToken = async (req, res, next) => {
    try {
        const authorization = req.header("authorization");
        const token = authorization?.startsWith("Bearer ")
            ? authorization.slice("Bearer ".length)
            : null;
        if (!token) {
            throw new AppError({
                statusCode: 401,
                code: "AUTHENTICATION_REQUIRED",
                message: "Authentication is required",
            });
        }
        const payload = await verifyAccessToken(token);
        setPrincipal(res, {
            userId: payload.userId,
            role: payload.role,
            sessionId: payload.sessionId,
        });
        next();
    }
    catch (error) {
        next(error instanceof AppError
            ? error
            : new AppError({
                statusCode: 401,
                code: "INVALID_ACCESS_TOKEN",
                message: "Access token is invalid or expired",
            }));
    }
};
export const authenticateOptionalAccessToken = async (req, res, next) => {
    try {
        const authorization = req.header("authorization");
        if (!authorization?.startsWith("Bearer ")) {
            next();
            return;
        }
        const payload = await verifyAccessToken(authorization.slice("Bearer ".length));
        setPrincipal(res, {
            userId: payload.userId,
            role: payload.role,
            sessionId: payload.sessionId,
        });
        next();
    }
    catch {
        next();
    }
};
//# sourceMappingURL=authentication.middleware.js.map