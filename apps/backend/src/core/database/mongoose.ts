import mongoose from "mongoose";

import { env } from "../config/env.js";
import { logger } from "../logging/logger.js";

let connectionPromise: Promise<void> | null = null;

/*
 * Idempotent: concurrent callers share one in-flight connection attempt, and a
 * failed attempt is cleared so the next caller retries instead of reusing the
 * rejected promise. This matters on serverless hosts, where every request on a
 * cold instance calls this before touching the database.
 */
export function connectDatabase(): Promise<void> {
  connectionPromise ??= openConnection().catch((error: unknown) => {
    connectionPromise = null;
    throw error;
  });

  return connectionPromise;
}

async function openConnection(): Promise<void> {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: env.NODE_ENV !== "production",
    // Atlas SRV lookup plus TLS handshake can exceed 5s on a cold instance.
    serverSelectionTimeoutMS: 10_000,
    // Many short-lived instances each hold a pool; keep it small so they do
    // not exhaust the cluster's connection limit.
    maxPoolSize: 10,
    // Drop sockets that sat idle (e.g. while a serverless instance was frozen)
    // instead of handing a dead socket to the next query.
    maxIdleTimeMS: 60_000,
    socketTimeoutMS: 45_000,
  });

  logger.info("MongoDB connection established");
}

/*
 * autoIndex is disabled in production, so index changes made in schema
 * definitions are not applied automatically on connect. This syncs them
 * explicitly (requires all models to have been imported already). It is too
 * slow and racy to run on every serverless cold start; use it from a
 * long-running server boot or the `db:sync-indexes` script instead.
 */
export async function syncDatabaseIndexes(): Promise<void> {
  await Promise.all(
    Object.values(mongoose.connection.models).map((connectionModel) =>
      connectionModel.syncIndexes(),
    ),
  );
  logger.info("MongoDB indexes synced");
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  connectionPromise = null;
  logger.info("MongoDB connection closed");
}
