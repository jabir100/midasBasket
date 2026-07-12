import { ZodError } from "zod";
import type { ErrorRequestHandler } from "express";

import { env } from "../config/env.js";
import { getRequestId } from "../http/request-id.middleware.js";
import { sendError } from "../http/send-response.js";
import { logger } from "../logging/logger.js";
import { AppError } from "./app-error.js";

type ValidationDetails = {
  formErrors?: readonly string[];
  fieldErrors?: Record<string, readonly string[] | undefined>;
};

type MongooseValidationError = Error & {
  errors?: Record<string, { message?: string }>;
};

type MongooseCastError = Error & {
  path?: string;
};

type DuplicateKeyError = Error & {
  code?: number;
  keyPattern?: Record<string, unknown>;
  keyValue?: Record<string, unknown>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function formatFieldName(field: string): string {
  return field
    .replace(/\[(\d+)\]/g, " $1")
    .replace(/[._-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatValidationMessage(
  details: ValidationDetails,
  fallbackMessage: string,
): string {
  const messages: string[] = [];

  if (details.formErrors) {
    messages.push(
      ...details.formErrors.filter((message) => message.trim().length > 0),
    );
  }

  if (details.fieldErrors) {
    for (const [field, fieldMessages] of Object.entries(details.fieldErrors)) {
      if (!fieldMessages) {
        continue;
      }

      const firstMessage = fieldMessages.find(
        (message) => message.trim().length > 0,
      );

      if (firstMessage) {
        messages.push(`${formatFieldName(field)}: ${firstMessage}`);
      }
    }
  }

  return messages.length > 0
    ? `Please fix these fields: ${messages.join("; ")}`
    : fallbackMessage;
}

function getDuplicateKeyFields(error: DuplicateKeyError): string[] {
  const source = error.keyPattern ?? error.keyValue;

  if (!isRecord(source)) {
    return [];
  }

  return Object.keys(source);
}

function buildDuplicateKeyMessage(error: DuplicateKeyError): string {
  const fields = getDuplicateKeyFields(error);

  if (fields.length === 0) {
    return "A record with this value already exists.";
  }

  const formattedFields = fields.map((field) => formatFieldName(field));

  return formattedFields.length === 1
    ? `${formattedFields[0]} already exists.`
    : `${formattedFields.join(", ")} already exist.`;
}

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  _next,
) => {
  const requestId = getRequestId(res);

  if (error instanceof AppError) {
    sendError(res, {
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
      details: error.details,
      requestId,
    });
    return;
  }

  if (error instanceof ZodError) {
    const details = error.flatten();

    sendError(res, {
      statusCode: 422,
      code: "VALIDATION_ERROR",
      message: formatValidationMessage(details, "Request validation failed"),
      details,
      requestId,
    });
    return;
  }

  if (error instanceof Error && error.name === "ValidationError") {
    const mongooseError = error as MongooseValidationError;
    const details: ValidationDetails = {
      fieldErrors: Object.fromEntries(
        Object.entries(mongooseError.errors ?? {}).map(
          ([field, validationError]) => [
            field,
            [validationError.message ?? "Invalid value"],
          ],
        ),
      ),
    };

    sendError(res, {
      statusCode: 422,
      code: "VALIDATION_ERROR",
      message: formatValidationMessage(details, "Model validation failed"),
      details,
      requestId,
    });
    return;
  }

  if (error instanceof Error && error.name === "CastError") {
    const castError = error as MongooseCastError;

    sendError(res, {
      statusCode: 422,
      code: "INVALID_FIELD_VALUE",
      message: `${castError.path ? formatFieldName(castError.path) : "Field"} is invalid.`,
      details: castError.path
        ? { fieldErrors: { [castError.path]: ["Invalid value"] } }
        : undefined,
      requestId,
    });
    return;
  }

  if (error instanceof Error && (error as DuplicateKeyError).code === 11000) {
    const duplicateKeyError = error as DuplicateKeyError;

    sendError(res, {
      statusCode: 409,
      code: "DUPLICATE_KEY_ERROR",
      message: buildDuplicateKeyMessage(duplicateKeyError),
      details: {
        fieldErrors: Object.fromEntries(
          getDuplicateKeyFields(duplicateKeyError).map((field) => [
            field,
            ["Already exists"],
          ]),
        ),
      },
      requestId,
    });
    return;
  }

  logger.error({ error, requestId }, "Unhandled application error");

  sendError(res, {
    statusCode: 500,
    code: "INTERNAL_SERVER_ERROR",
    message:
      env.NODE_ENV === "production"
        ? "Internal server error"
        : "Unexpected server error",
    requestId,
  });
};
