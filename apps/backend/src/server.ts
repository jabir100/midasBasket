import { createApp } from "./app.js";
import { env } from "./core/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "./core/database/mongoose.js";
import { connectRedis, disconnectRedis } from "./core/database/redis.js";
import { logger } from "./core/logging/logger.js";

async function bootstrap(): Promise<void> {
  const app = createApp();

  await connectDatabase();
  await connectRedis();

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
