import { createFileRoute } from "@tanstack/react-router";

import { DashboardProfilePage } from "../features/dashboard/dashboard-profile-page.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/dashboard_/profile")({
  head: () => ({
    meta: [{ title: "Profile | Midas Basket" }, noIndexMeta],
  }),
  component: DashboardProfilePage,
});
