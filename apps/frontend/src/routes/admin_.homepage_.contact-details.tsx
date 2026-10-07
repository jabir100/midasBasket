import { createFileRoute } from "@tanstack/react-router";

import { AdminHomepageContactDetailsPage } from "../features/admin/homepage-contact-details-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin_/homepage_/contact-details")({
  head: () => ({
    meta: [{ title: "Contact Details | Midas Basket Admin" }, noIndexMeta],
  }),
  component: AdminHomepageContactDetailsPage,
});
