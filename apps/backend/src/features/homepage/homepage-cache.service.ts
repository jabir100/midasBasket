import { getRedisClient } from "../../core/database/redis.js";
import { logger } from "../../core/logging/logger.js";

const HOMEPAGE_CACHE_KEY = "homepage:v1:payload";
const HOMEPAGE_CACHE_TTL = 3600;

const homepageCacheKeys = [HOMEPAGE_CACHE_KEY] as const;

export async function getHomepageCache(): Promise<string | null> {
  const redis = getRedisClient();

  if (!redis) {
    return null;
  }

  try {
    return await redis.get(HOMEPAGE_CACHE_KEY);
  } catch (error) {
    logger.error({ error }, "Failed to read homepage cache");
    return null;
  }
}

export async function setHomepageCache(payload: string): Promise<void> {
  const redis = getRedisClient();

  if (!redis) {
    return;
  }

  try {
    await redis.set(HOMEPAGE_CACHE_KEY, payload, { EX: HOMEPAGE_CACHE_TTL });
    logger.info("Homepage cache updated");
  } catch (error) {
    logger.error({ error }, "Failed to write homepage cache");
  }
}

export async function invalidateHomepageCache(reason: string): Promise<void> {
  const redis = getRedisClient();

  if (!redis) {
    return;
  }

  try {
    await redis.del([...homepageCacheKeys]);
    logger.info(
      { reason, keys: homepageCacheKeys },
      "Homepage cache invalidated",
    );
  } catch (error) {
    logger.error({ error, reason }, "Failed to invalidate homepage cache");
  }
}
