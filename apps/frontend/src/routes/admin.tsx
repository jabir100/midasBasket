import { createFileRoute } from "@tanstack/react-router";

import { AdminDashboardPage } from "../features/admin/admin-pages.js";

export const Route = createFileRoute("/admin")({
  component: AdminDashboardPage,
});
