import type { RequestHandler } from "express";

import { getRequestId } from "../http/request-id.middleware.js";
import { sendError } from "../http/send-response.js";

export const notFoundHandler: RequestHandler = (req, res) => {
  sendError(res, {
    statusCode: 404,
    code: "ROUTE_NOT_FOUND",
    message: `Route ${req.method} ${req.originalUrl} was not found`,
    requestId: getRequestId(res),
  });
};
