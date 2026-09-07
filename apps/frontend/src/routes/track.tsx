import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { TrackOrderPage } from "../features/orders/track-order-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

const trackSearchSchema = z.object({
  orderNumber: z.string().optional(),
  email: z.string().optional(),
});

export const Route = createFileRoute("/track")({
  validateSearch: trackSearchSchema,
  head: () => ({
    meta: [{ title: "Track Order | Midas Basket" }, noIndexMeta],
  }),
  component: TrackOrderPage,
});
