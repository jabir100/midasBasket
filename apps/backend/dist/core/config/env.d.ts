export declare const env: Readonly<{
    NODE_ENV: "development" | "test" | "production";
    PORT: number;
    API_BASE_PATH: string;
    CLIENT_ORIGINS: string[];
    MONGODB_URI: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_TOKEN_TTL_SECONDS: number;
    JWT_REFRESH_TOKEN_TTL_SECONDS: number;
    REDIS_URL?: string | undefined;
    REDIS_HOST?: string | undefined;
    REDIS_PORT?: number | undefined;
    REDIS_USERNAME?: string | undefined;
    REDIS_PASSWORD?: string | undefined;
    REDIS_TLS?: boolean | undefined;
    COOKIE_DOMAIN?: string | undefined;
    CLOUDINARY_CLOUD_NAME?: string | undefined;
    CLOUDINARY_API_KEY?: string | undefined;
    CLOUDINARY_API_SECRET?: string | undefined;
}>;
export type AppEnvironment = typeof env;
//# sourceMappingURL=env.d.ts.map