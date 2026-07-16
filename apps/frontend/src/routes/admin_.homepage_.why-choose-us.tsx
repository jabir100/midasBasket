import { createFileRoute } from "@tanstack/react-router";

import { AdminHomepageWhyChooseUsPage } from "../features/admin/homepage-why-choose-us-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin_/homepage_/why-choose-us")({
  head: () => ({
    meta: [{ title: "Why Choose Us | Midas Basket Admin" }, noIndexMeta],
  }),
  component: AdminHomepageWhyChooseUsPage,
});
