import { randomUUID } from "node:crypto";
import type { RequestHandler, Response } from "express";

const requestIdKey = "requestId";

export const requestIdMiddleware: RequestHandler = (req, res, next) => {
  const incomingRequestId = req.header("x-request-id");
  const requestId =
    incomingRequestId && incomingRequestId.length <= 128
      ? incomingRequestId
      : randomUUID();

  res.locals[requestIdKey] = requestId;
  res.setHeader("x-request-id", requestId);

  next();
};

export function getRequestId(res: Response): string {
  const locals = res.locals as Record<string, unknown>;
  const requestId = locals[requestIdKey];
  return typeof requestId === "string" ? requestId : "unknown";
}
