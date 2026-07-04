import { config } from "dotenv";
import { z } from "zod";

config();

const commaSeparatedOrigins = z
  .string()
  .min(1)
  .transform((value) =>
    value
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  );

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(4000),
  API_BASE_PATH: z.string().startsWith("/").default("/api/v1"),
  CLIENT_ORIGINS: commaSeparatedOrigins,
  MONGODB_URI: z.string().min(1),
  REDIS_URL: z.string().min(1).optional(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  JWT_REFRESH_TOKEN_TTL_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(2_592_000),
  COOKIE_DOMAIN: z.string().min(1).optional(),
});

export const env = Object.freeze(envSchema.parse(process.env));

export type AppEnvironment = typeof env;
