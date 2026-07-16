import { AppError } from "../../core/errors/app-error.js";
const principalKey = "principal";
export function setPrincipal(res, principal) {
    res.locals[principalKey] = principal;
}
export function getPrincipal(res) {
    const locals = res.locals;
    const principal = locals[principalKey];
    if (!isAuthenticatedPrincipal(principal)) {
        return null;
    }
    return principal;
}
export function requireRoles(allowedRoles) {
    return (_req, res, next) => {
        const principal = getPrincipal(res);
        if (!principal) {
            next(new AppError({
                statusCode: 401,
                code: "AUTHENTICATION_REQUIRED",
                message: "Authentication is required",
            }));
            return;
        }
        if (!allowedRoles.includes(principal.role)) {
            next(new AppError({
                statusCode: 403,
                code: "INSUFFICIENT_PERMISSIONS",
                message: "Insufficient permissions",
            }));
            return;
        }
        next();
    };
}
function isAuthenticatedPrincipal(value) {
    if (!value || typeof value !== "object") {
        return false;
    }
    const candidate = value;
    return (typeof candidate.userId === "string" &&
        typeof candidate.sessionId === "string" &&
        (candidate.role === "admin" || candidate.role === "customer"));
}
//# sourceMappingURL=authorization.middleware.js.map