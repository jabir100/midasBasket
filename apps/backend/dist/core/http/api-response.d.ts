export type ApiPaginationMeta = {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
};
export type ApiSuccessResponse<TData> = {
    success: true;
    data: TData;
    requestId: string;
    meta?: Record<string, unknown>;
};
export type ApiErrorBody = {
    code: string;
    message: string;
    details?: unknown;
};
export type ApiErrorResponse = {
    success: false;
    error: ApiErrorBody;
    requestId: string;
};
export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;
//# sourceMappingURL=api-response.d.ts.map