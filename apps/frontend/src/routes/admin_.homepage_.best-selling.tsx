import { createFileRoute } from "@tanstack/react-router";

import { AdminHomepageBestSellingPage } from "../features/admin/homepage-best-selling-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin_/homepage_/best-selling")({
  head: () => ({
    meta: [{ title: "Most Selling | Midas Basket Admin" }, noIndexMeta],
  }),
  component: AdminHomepageBestSellingPage,
});
