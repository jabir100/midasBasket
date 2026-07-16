import { createFileRoute } from "@tanstack/react-router";

import { AdminHomepageCarouselPage } from "../features/admin/homepage-carousel-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin_/homepage_/carousel")({
  head: () => ({
    meta: [{ title: "Carousel | Midas Basket Admin" }, noIndexMeta],
  }),
  component: AdminHomepageCarouselPage,
});
