import { createFileRoute } from "@tanstack/react-router";

import { ForgotPasswordPage } from "../features/auth/auth-pages.js";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});
