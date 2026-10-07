import { getRedisClient, withRedisTimeout } from "../../core/database/redis.js";
import { logger } from "../../core/logging/logger.js";
const CONTACT_CACHE_KEY = "contact:v1:public";
const CONTACT_CACHE_TTL = 3600;
export async function getContactCache() {
    const redis = getRedisClient();
    if (!redis) {
        return null;
    }
    try {
        return await withRedisTimeout(redis.get(CONTACT_CACHE_KEY));
    }
    catch (error) {
        logger.error({ error }, "Failed to read contact cache");
        return null;
    }
}
export async function setContactCache(payload) {
    const redis = getRedisClient();
    if (!redis) {
        return;
    }
    try {
        await withRedisTimeout(redis.set(CONTACT_CACHE_KEY, payload, { EX: CONTACT_CACHE_TTL }));
    }
    catch (error) {
        logger.error({ error }, "Failed to write contact cache");
    }
}
export async function invalidateContactCache(reason) {
    const redis = getRedisClient();
    if (!redis) {
        return;
    }
    try {
        await withRedisTimeout(redis.del(CONTACT_CACHE_KEY));
        logger.info({ reason, key: CONTACT_CACHE_KEY }, "Contact cache invalidated");
    }
    catch (error) {
        logger.error({ error, reason }, "Failed to invalidate contact cache");
    }
}
//# sourceMappingURL=contact-cache.service.js.map