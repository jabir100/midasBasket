import { createFileRoute } from "@tanstack/react-router";

import { LoginPage } from "../features/auth/auth-pages.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Login | Midas Basket" }, noIndexMeta],
  }),
  component: LoginPage,
});
