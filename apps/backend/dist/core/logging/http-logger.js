import { pinoHttp } from "pino-http";
import { getRequestId } from "../http/request-id.middleware.js";
import { logger } from "./logger.js";
export const httpLogger = pinoHttp({
    logger,
    genReqId: (_req, res) => getRequestId(res),
});
//# sourceMappingURL=http-logger.js.map