import { createClient, type RedisClientType } from "redis";

import { env } from "../config/env.js";
import { logger } from "../logging/logger.js";

const REDIS_COMMAND_TIMEOUT_MS = 1_500;

let redisClient: RedisClientType | null = null;
let connectPromise: Promise<RedisClientType | null> | null = null;

/*
 * Redis is an optional cache, so this never rejects: a failed connection is
 * logged and leaves the cache disabled until a later call retries.
 */
export function connectRedis(): Promise<RedisClientType | null> {
  connectPromise ??= openConnection();
  return connectPromise;
}

async function openConnection(): Promise<RedisClientType | null> {
  if (!env.REDIS_URL) {
    logger.warn("Redis URL is not configured; cache features are disabled");
    return null;
  }

  const client: RedisClientType = createClient({
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

  client.on("error", (error: Error) => {
    logger.error({ error }, "Redis client error");
  });

  try {
    await client.connect();
  } catch (error) {
    logger.error(
      { error },
      "Redis connection failed; cache features are disabled",
    );
    connectPromise = null;
    client.destroy();
    return null;
  }

  redisClient = client;
  logger.info("Redis connection established");

  return client;
}

/* Returns the client only while it can serve commands right now. */
export function getRedisClient(): RedisClientType | null {
  return redisClient?.isReady ? redisClient : null;
}

/*
 * Bounds a cache command so a half-open socket (common after a serverless
 * instance is thawed) cannot hang the request; callers treat the rejection as
 * a cache miss.
 */
export function withRedisTimeout<T>(command: Promise<T>): Promise<T> {
  let timer: NodeJS.Timeout | undefined;

  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(
        new Error(
          `Redis command timed out after ${String(REDIS_COMMAND_TIMEOUT_MS)}ms`,
        ),
      );
    }, REDIS_COMMAND_TIMEOUT_MS);
  });

  return Promise.race([command, timeout]).finally(() => {
    clearTimeout(timer);
  });
}

export async function disconnectRedis(): Promise<void> {
  if (!redisClient) {
    return;
  }

  await redisClient.quit();
  redisClient = null;
  connectPromise = null;
  logger.info("Redis connection closed");
}
