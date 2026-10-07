import { attachDatabasePool } from "@vercel/functions";
import mongoose from "mongoose";
import { createApp } from "./app.js";
import { connectDatabase } from "./core/database/mongoose.js";
import { connectRedis } from "./core/database/redis.js";
import { logger } from "./core/logging/logger.js";
/*
 * Serverless entry point. Unlike server.ts it never listens, never exits the
 * process, and never connects at import time: a failed connection on a cold
 * start becomes a 503 for that request (with CORS headers, so the browser can
 * read it) and the next request retries, instead of crashing the instance.
 */
// A stray rejection must not take down an instance serving other requests.
process.on("unhandledRejection", (reason) => {
    logger.error({ error: reason }, "Unhandled promise rejection");
});
let isPoolAttached = false;
async function ensureConnections() {
    // Cache is optional: requests run uncached until Redis is ready.
    void connectRedis();
    await connectDatabase();
    if (!isPoolAttached) {
        // Lets Vercel keep the instance alive long enough to close idle sockets
        // before suspending it, so they are not leaked on the cluster.
        attachDatabasePool(mongoose.connection.getClient());
        isPoolAttached = true;
    }
}
export default createApp({ ensureConnections });
//# sourceMappingURL=vercel.js.map