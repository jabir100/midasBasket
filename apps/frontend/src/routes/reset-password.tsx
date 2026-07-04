import { createFileRoute } from "@tanstack/react-router";

import { ResetPasswordPage } from "../features/auth/auth-pages.js";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});
