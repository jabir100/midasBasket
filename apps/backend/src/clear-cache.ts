import { invalidateHomepageCache } from "./features/homepage/homepage-cache.service.js";
import { getRedisClient } from "./core/database/redis.js";

async function clear() {
  // Wait a moment for connection
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await invalidateHomepageCache("manual-seeding-invalidation");
  console.log("Redis cache invalidated successfully");
  process.exit(0);
}

clear().catch(console.error);
