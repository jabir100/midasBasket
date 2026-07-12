import { createFileRoute } from "@tanstack/react-router";

import { TrackOrderPage } from "../features/orders/track-order-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [{ title: "Track Order | Midas Basket" }, noIndexMeta],
  }),
  component: TrackOrderPage,
});
