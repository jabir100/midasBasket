import { createFileRoute } from "@tanstack/react-router";

import { AccountPage } from "../features/auth/auth-pages.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [{ title: "Account | Midas Basket" }, noIndexMeta],
  }),
  component: AccountPage,
});
