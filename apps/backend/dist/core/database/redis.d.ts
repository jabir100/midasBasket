import { type RedisClientType } from "redis";
export declare function connectRedis(): Promise<RedisClientType | null>;
export declare function getRedisClient(): RedisClientType | null;
export declare function disconnectRedis(): Promise<void>;
//# sourceMappingURL=redis.d.ts.map