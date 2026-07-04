import { getRedisClient } from "../../core/database/redis.js";
import { logger } from "../../core/logging/logger.js";

const homepageCacheKeys = ["homepage:v1:published"] as const;

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
