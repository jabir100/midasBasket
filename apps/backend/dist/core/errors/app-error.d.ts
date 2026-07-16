export type AppErrorOptions = {
    statusCode: number;
    code: string;
    message: string;
    details?: unknown;
    isOperational?: boolean;
};
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly details?: unknown;
    readonly isOperational: boolean;
    constructor(options: AppErrorOptions);
}
//# sourceMappingURL=app-error.d.ts.map