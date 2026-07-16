import { createFileRoute } from "@tanstack/react-router";

import { AdminHomepageHubPage } from "../features/admin/homepage-hub-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin_/homepage")({
  head: () => ({
    meta: [{ title: "Homepage Configuration | Midas Basket Admin" }, noIndexMeta],
  }),
  component: AdminHomepageHubPage,
});
