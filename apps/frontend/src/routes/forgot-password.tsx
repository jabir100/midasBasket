import { createFileRoute } from "@tanstack/react-router";

import { ForgotPasswordPage } from "../features/auth/auth-pages.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [{ title: "Forgot Password | Midas Basket" }, noIndexMeta],
  }),
  component: ForgotPasswordPage,
});
