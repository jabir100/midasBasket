export class AppError extends Error {
    statusCode;
    code;
    details;
    isOperational;
    constructor(options) {
        super(options.message);
        this.name = "AppError";
        this.statusCode = options.statusCode;
        this.code = options.code;
        this.details = options.details;
        this.isOperational = options.isOperational ?? true;
    }
}
//# sourceMappingURL=app-error.js.map