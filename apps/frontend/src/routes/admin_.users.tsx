import { createFileRoute } from "@tanstack/react-router";

import { AdminUsersPage } from "../features/admin/users-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin_/users")({
  head: () => ({
    meta: [{ title: "Users | Midas Basket Admin" }, noIndexMeta],
  }),
  component: AdminUsersPage,
});
