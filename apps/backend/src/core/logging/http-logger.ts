import type { Request, Response } from "express";
import { pinoHttp, type HttpLogger } from "pino-http";

import { getRequestId } from "../http/request-id.middleware.js";
import { logger } from "./logger.js";

export const httpLogger: HttpLogger<Request, Response> = pinoHttp<
  Request,
  Response
>({
  logger,
  genReqId: (_req, res) => getRequestId(res),
});
