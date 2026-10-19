import dns from "node:dns";

import { createApp } from "./app.js";
import { env } from "./core/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
  syncDatabaseIndexes,
} from "./core/database/mongoose.js";
import { connectRedis, disconnectRedis } from "./core/database/redis.js";
import { logger } from "./core/logging/logger.js";

/* Entry point for long-running Node hosts. Vercel uses ./vercel.ts instead. */
async function bootstrap(): Promise<void> {
  // Some local/ISP resolvers fail the SRV lookup for mongodb+srv:// URIs,
  // so use public resolvers before connecting.
  dns.setServers(["8.8.8.8", "1.1.1.1"]);

  const app = createApp();

  await connectDatabase();

  if (env.NODE_ENV === "production") {
    await syncDatabaseIndexes();
  }

  // Cache is optional: start serving without waiting for Redis.
  void connectRedis();

  const server = app.listen(env.PORT, () => {
    logger.info(
      { port: env.PORT, basePath: env.API_BASE_PATH },
      "Backend server started",
    );
  });

  const shutdown = (signal: NodeJS.Signals): void => {
    logger.info({ signal }, "Shutting down backend server");

    server.close(() => {
      void closeResources();
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

async function closeResources(): Promise<void> {
  await disconnectRedis();
  await disconnectDatabase();
  process.exit(0);
}

bootstrap().catch((error: unknown) => {
  logger.fatal({ error }, "Backend bootstrap failed");
  process.exit(1);
});
