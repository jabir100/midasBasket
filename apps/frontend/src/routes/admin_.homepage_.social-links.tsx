import { createFileRoute } from "@tanstack/react-router";

import { AdminHomepageSocialLinksPage } from "../features/admin/homepage-social-links-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin_/homepage_/social-links")({
  head: () => ({
    meta: [{ title: "Social Media | Midas Basket Admin" }, noIndexMeta],
  }),
  component: AdminHomepageSocialLinksPage,
});
