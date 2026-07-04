import { createFileRoute } from "@tanstack/react-router";

import { CustomerDashboardPage } from "../features/dashboard/dashboard-pages.js";

export const Route = createFileRoute("/dashboard")({
  component: CustomerDashboardPage,
});
