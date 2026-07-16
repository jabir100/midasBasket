import { createClient } from "redis";
import { env } from "../config/env.js";
import { logger } from "../logging/logger.js";
let redisClient = null;
export async function connectRedis() {
    if (!env.REDIS_URL) {
        logger.warn("Redis URL is not configured; cache features are disabled");
        return null;
    }
    redisClient = createClient({ url: env.REDIS_URL });
    redisClient.on("error", (error) => {
        logger.error({ error }, "Redis client error");
    });
    await redisClient.connect();
    logger.info("Redis connection established");
    return redisClient;
}
export function getRedisClient() {
    return redisClient;
}
export async function disconnectRedis() {
    if (!redisClient) {
        return;
    }
    await redisClient.quit();
    redisClient = null;
    logger.info("Redis connection closed");
}
//# sourceMappingURL=redis.js.map