import { randomUUID } from "node:crypto";
const requestIdKey = "requestId";
export const requestIdMiddleware = (req, res, next) => {
    const incomingRequestId = req.header("x-request-id");
    const requestId = incomingRequestId && incomingRequestId.length <= 128
        ? incomingRequestId
        : randomUUID();
    res.locals[requestIdKey] = requestId;
    res.setHeader("x-request-id", requestId);
    next();
};
export function getRequestId(res) {
    const locals = res.locals;
    const requestId = locals[requestIdKey];
    return typeof requestId === "string" ? requestId : "unknown";
}
//# sourceMappingURL=request-id.middleware.js.map