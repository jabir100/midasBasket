import mongoose from "mongoose";
import { env } from "../config/env.js";
import { logger } from "../logging/logger.js";
export async function connectDatabase() {
    mongoose.set("strictQuery", true);
    await mongoose.connect(env.MONGODB_URI, {
        autoIndex: env.NODE_ENV !== "production",
        serverSelectionTimeoutMS: 5_000,
    });
    logger.info("MongoDB connection established");
}
export async function disconnectDatabase() {
    await mongoose.disconnect();
    logger.info("MongoDB connection closed");
}
//# sourceMappingURL=mongoose.js.map