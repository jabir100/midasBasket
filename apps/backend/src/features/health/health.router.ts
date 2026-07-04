import { Router, type Router as ExpressRouter } from "express";

import { env } from "../../core/config/env.js";
import { getRequestId } from "../../core/http/request-id.middleware.js";
import { sendSuccess } from "../../core/http/send-response.js";

export const healthRouter: ExpressRouter = Router();

healthRouter.get("/", (_req, res) => {
  sendSuccess(res, {
    data: {
      status: "ok",
      environment: env.NODE_ENV,
      uptimeSeconds: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    requestId: getRequestId(res),
  });
});
