import { Router } from "express";
import { getRequestId } from "../../core/http/request-id.middleware.js";
import { sendSuccess } from "../../core/http/send-response.js";
export const healthRouter = Router();
/* Public endpoint: expose liveness only, never runtime details (environment, uptime). */
healthRouter.get("/", (_req, res) => {
    sendSuccess(res, {
        data: {
            status: "ok",
            timestamp: new Date().toISOString(),
        },
        requestId: getRequestId(res),
    });
});
//# sourceMappingURL=health.router.js.map