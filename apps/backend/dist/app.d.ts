import { type Express } from "express";
export type CreateAppOptions = {
    ensureConnections?: () => Promise<void>;
};
export declare function createApp(options?: CreateAppOptions): Express;
//# sourceMappingURL=app.d.ts.map