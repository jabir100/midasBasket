import type { Response } from "express";

import type { ApiErrorResponse, ApiSuccessResponse } from "./api-response.js";

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

export function sendSuccess<TData>(
  res: Response,
  options: SendSuccessOptions<TData>,
): void {
  const body: ApiSuccessResponse<TData> = {
    success: true,
    data: options.data,
    requestId: options.requestId,
  };

  if (options.meta) {
    body.meta = options.meta;
  }

  res.status(options.statusCode ?? 200).json(body);
}

export function sendError(res: Response, options: SendErrorOptions): void {
  const errorBody: ApiErrorResponse["error"] = {
    code: options.code,
    message: options.message,
  };

  if (options.details !== undefined) {
    errorBody.details = options.details;
  }

  const body: ApiErrorResponse = {
    success: false,
    error: errorBody,
    requestId: options.requestId,
  };

  res.status(options.statusCode).json(body);
}
