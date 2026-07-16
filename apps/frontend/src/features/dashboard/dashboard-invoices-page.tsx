import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { listInvoices } from "./dashboard-api.js";
import { DashboardPageShell } from "./dashboard-page-shell.js";
import { InvoicesPanel } from "./invoices-panel.js";

export function DashboardInvoicesPage(): ReactNode {
  const invoicesQuery = useQuery({
    queryKey: ["dashboard", "invoices"],
    queryFn: listInvoices,
  });

  return (
    <DashboardPageShell>
      <InvoicesPanel
        invoices={invoicesQuery.data ?? []}
        isLoading={invoicesQuery.isLoading}
      />
    </DashboardPageShell>
  );
}
