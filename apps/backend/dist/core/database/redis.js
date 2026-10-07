import { createClient } from "redis";
import { env } from "../config/env.js";
import { logger } from "../logging/logger.js";
const REDIS_COMMAND_TIMEOUT_MS = 1_500;
let redisClient = null;
let connectPromise = null;
/*
 * Redis is an optional cache, so this never rejects: a failed connection is
 * logged and leaves the cache disabled until a later call retries.
 */
export function connectRedis() {
    connectPromise ??= openConnection();
    return connectPromise;
}
async function openConnection() {
    if (!env.REDIS_URL) {
        logger.warn("Redis URL is not configured; cache features are disabled");
        return null;
    }
    const client = createClient({
        url: env.REDIS_URL,
        // Fail commands immediately while disconnected instead of queueing them
        // and stalling the request until the socket comes back.
        disableOfflineQueue: true,
        // Keeps idle connections from being dropped by managed Redis providers.
        pingInterval: 60_000,
        socket: {
            connectTimeout: 5_000,
            reconnectStrategy: (retries) => Math.min(250 * 2 ** retries, 10_000),
        },
    });
    client.on("error", (error) => {
        logger.error({ error }, "Redis client error");
    });
    try {
        await client.connect();
    }
    catch (error) {
        logger.error({ error }, "Redis connection failed; cache features are disabled");
        connectPromise = null;
        client.destroy();
        return null;
    }
    redisClient = client;
    logger.info("Redis connection established");
    return client;
}
/* Returns the client only while it can serve commands right now. */
export function getRedisClient() {
    return redisClient?.isReady ? redisClient : null;
}
/*
 * Bounds a cache command so a half-open socket (common after a serverless
 * instance is thawed) cannot hang the request; callers treat the rejection as
 * a cache miss.
 */
export function withRedisTimeout(command) {
    let timer;
    const timeout = new Promise((_resolve, reject) => {
        timer = setTimeout(() => {
            reject(new Error(`Redis command timed out after ${String(REDIS_COMMAND_TIMEOUT_MS)}ms`));
        }, REDIS_COMMAND_TIMEOUT_MS);
    });
    return Promise.race([command, timeout]).finally(() => {
        clearTimeout(timer);
    });
}
export async function disconnectRedis() {
    if (!redisClient) {
        return;
    }
    await redisClient.quit();
    redisClient = null;
    connectPromise = null;
    logger.info("Redis connection closed");
}
//# sourceMappingURL=redis.js.map