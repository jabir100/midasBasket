export function sendSuccess(res, options) {
    const body = {
        success: true,
        data: options.data,
        requestId: options.requestId,
    };
    if (options.meta) {
        body.meta = options.meta;
    }
    res.status(options.statusCode ?? 200).json(body);
}
export function sendError(res, options) {
    const errorBody = {
        code: options.code,
        message: options.message,
    };
    if (options.details !== undefined) {
        errorBody.details = options.details;
    }
    const body = {
        success: false,
        error: errorBody,
        requestId: options.requestId,
    };
    res.status(options.statusCode).json(body);
}
//# sourceMappingURL=send-response.js.map