import type { Response } from "express";
export type SendSuccessOptions<TData> = {
    statusCode?: number;
    data: TData;
    requestId: string;
    meta?: Record<string, unknown>;
};
export type SendErrorOptions = {
    statusCode: number;
    code: string;
    message: string;
    requestId: string;
    details?: unknown;
};
export declare function sendSuccess<TData>(res: Response, options: SendSuccessOptions<TData>): void;
export declare function sendError(res: Response, options: SendErrorOptions): void;
//# sourceMappingURL=send-response.d.ts.map