import mongoose from "mongoose";

import { env } from "../config/env.js";
import { logger } from "../logging/logger.js";

export async function connectDatabase(): Promise<void> {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: env.NODE_ENV !== "production",
    serverSelectionTimeoutMS: 5_000,
  });

  logger.info("MongoDB connection established");

  if (env.NODE_ENV === "production") {
    // autoIndex is disabled in production, so index changes made in schema
    // definitions are not applied automatically on connect. Sync them
    // explicitly here (requires all models to have been imported already).
    await Promise.all(
      Object.values(mongoose.connection.models).map((connectionModel) =>
        connectionModel.syncIndexes(),
      ),
    );
    logger.info("MongoDB indexes synced");
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info("MongoDB connection closed");
}
