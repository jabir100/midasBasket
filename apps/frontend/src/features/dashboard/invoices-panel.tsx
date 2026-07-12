import { Receipt } from "lucide-react";
import type { ReactNode } from "react";
import { Skeleton } from "@heroui/react";

import { Card, CardBody } from "../../shared/ui/card.js";
import { OrderStatusBadge, PaymentStatusBadge } from "../admin/status-badge.js";
import type { DashboardInvoice } from "./dashboard-api.js";

export function InvoicesPanel({
  invoices,
  isLoading,
}: Readonly<{
  invoices: DashboardInvoice[];
  isLoading: boolean;
}>): ReactNode {
  return (
    <div className="dashboard-pane-content">
      <div className="section-heading">
        <h3>Invoices</h3>
        <p>View and download invoices for your completed purchases.</p>
      </div>

      <Card className="dashboard-card" style={{ marginTop: "1.5rem" }}>
        <CardBody>
          <h2>Invoice Records</h2>

          {isLoading ? (
            <div className="admin-skeleton-stack">
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ) : null}

          {!isLoading && invoices.length > 0 ? (
            <div className="admin-table-shell">
              <table
                className="admin-table admin-table-compact"
                role="table"
                aria-label="Invoices table"
              >
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>
                        <strong>{invoice.invoiceNumber}</strong>
                      </td>
                      <td>{invoice.orderNumber}</td>
                      <td>
                        <OrderStatusBadge status={invoice.status} />
                      </td>
                      <td>
                        <PaymentStatusBadge status={invoice.paymentStatus} />
                      </td>
                      <td>
                        <strong>
                          {invoice.currency}{" "}
                          {invoice.total.toLocaleString("en-BD")}
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {!isLoading && invoices.length === 0 ? (
            <div className="admin-empty-state">
              <Receipt size={28} />
              <p style={{ margin: 0 }}>No invoices generated yet.</p>
            </div>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}
