import { createApp } from "./app.js";
import { env } from "./core/config/env.js";
import { connectDatabase, disconnectDatabase, } from "./core/database/mongoose.js";
import { connectRedis, disconnectRedis } from "./core/database/redis.js";
import { logger } from "./core/logging/logger.js";
async function bootstrap() {
    await connectDatabase();
    await connectRedis();
    const app = createApp();
    const server = app.listen(env.PORT, () => {
        logger.info({ port: env.PORT, basePath: env.API_BASE_PATH }, "Backend server started");
    });
    const shutdown = (signal) => {
        logger.info({ signal }, "Shutting down backend server");
        server.close(() => {
            void closeResources();
        });
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}
async function closeResources() {
    await disconnectRedis();
    await disconnectDatabase();
    process.exit(0);
}
bootstrap().catch((error) => {
    logger.fatal({ error }, "Backend bootstrap failed");
    process.exit(1);
});
//# sourceMappingURL=server.js.map