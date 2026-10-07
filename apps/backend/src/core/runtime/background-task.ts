import { waitUntil } from "@vercel/functions";

import { logger } from "../logging/logger.js";

/*
 * Runs work that must not delay or fail the response (e.g. emails).
 * - Rejections are logged, never left unhandled: an unhandled rejection
 *   crashes the process and every request in flight on it.
 * - On Vercel, waitUntil keeps the instance alive until the task settles so it
 *   is not frozen mid-send. Elsewhere it is a no-op.
 */
export function runInBackground(name: string, task: Promise<unknown>): void {
  waitUntil(
    task.catch((error: unknown) => {
      logger.error({ error, task: name }, "Background task failed");
    }),
  );
}
