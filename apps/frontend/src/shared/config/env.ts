import { z } from "zod";

const frontendEnvSchema = z.object({
  VITE_PUBLIC_APP_NAME: z.string().min(1).default("Midas Basket"),
  VITE_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  VITE_API_BASE_URL: z.url().default("http://localhost:4000/api/v1"),
});

export const frontendEnv = Object.freeze(
  frontendEnvSchema.parse(import.meta.env),
);

export type FrontendEnvironment = typeof frontendEnv;
