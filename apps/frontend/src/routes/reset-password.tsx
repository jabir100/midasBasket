import { createFileRoute } from "@tanstack/react-router";

import { ResetPasswordPage } from "../features/auth/auth-pages.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Reset Password | Midas Basket" }, noIndexMeta],
  }),
  component: ResetPasswordPage,
});
