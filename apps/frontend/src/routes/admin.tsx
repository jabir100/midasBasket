import { createFileRoute } from "@tanstack/react-router";

import { AdminPageShell } from "../features/admin/admin-page-shell.js";
import { OverviewPanel } from "../features/admin/overview-panel.js";
import { noIndexMeta } from "../shared/seo/seo.js";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Dashboard | Midas Basket" }, noIndexMeta],
  }),
  component: AdminOverviewRoute,
});

function AdminOverviewRoute() {
  return (
    <AdminPageShell>
      <OverviewPanel />
    </AdminPageShell>
  );
}
