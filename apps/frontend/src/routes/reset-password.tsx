import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { ResetPasswordPage } from "../features/auth/auth-pages.js";
import { noIndexMeta } from "../shared/seo/seo.js";

const resetPasswordSearchSchema = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute("/reset-password")({
  validateSearch: resetPasswordSearchSchema,
  head: () => ({
    meta: [{ title: "Reset Password | Midas Basket" }, noIndexMeta],
  }),
  component: ResetPasswordPage,
});
