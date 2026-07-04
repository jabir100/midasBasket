import { createFileRoute } from "@tanstack/react-router";

import { RegisterPage } from "../features/auth/auth-pages.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [{ title: "Create Account | Midas Basket" }, noIndexMeta],
  }),
  component: RegisterPage,
});
