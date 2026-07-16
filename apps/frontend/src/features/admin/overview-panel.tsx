import { useQuery } from "@tanstack/react-query";
import { BarChart3, Package, Shield, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { Skeleton } from "@heroui/react";

import { Card, CardBody } from "../../shared/ui/card.js";
import { getAdminSummary, listAuditLogs } from "./admin-api.js";

export function OverviewPanel(): ReactNode {
  const summaryQuery = useQuery({
    queryKey: ["admin", "summary"],
    queryFn: getAdminSummary,
  });
  const auditQuery = useQuery({
    queryKey: ["admin", "audit"],
    queryFn: () => listAuditLogs({ limit: 10 }),
  });

  return (
    <div className="dashboard-pane-content">
      <div className="section-heading">
        <div>
          <h3 style={{ margin: 0 }}>Admin dashboard</h3>
          <p
            style={{
              color: "var(--color-midas-gray)",
              margin: "0.25rem 0 0",
            }}
          >
            Operational analytics, account management, order lifecycle, and
            homepage settings.
          </p>
        </div>
      </div>

      {summaryQuery.data ? (
        <section className="admin-summary-grid" style={{ marginTop: "1.5rem" }}>
          <SummaryCard
            icon={<BarChart3 size={18} />}
            label="Revenue (lifetime)"
            value={`${summaryQuery.data.revenue.currency} ${summaryQuery.data.revenue.lifetime.toLocaleString("en-BD")}`}
          />
          <SummaryCard
            icon={<Truck size={18} />}
            label="Orders (7d)"
            value={summaryQuery.data.orders.recentOrders.toString()}
          />
          <SummaryCard
            icon={<Package size={18} />}
            label="Total orders"
            value={summaryQuery.data.orders.totalOrders.toString()}
          />
          <SummaryCard
            icon={<Shield size={18} />}
            label="Blocked users"
            value={summaryQuery.data.users.blockedUsers.toString()}
          />
        </section>
      ) : null}

      <Card className="dashboard-card admin-audit-card" style={{ marginTop: "2rem" }}>
        <CardBody>
          <h2>Recent audit logs</h2>
          {auditQuery.isLoading ? (
            <div className="admin-skeleton-stack">
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ) : null}

          {!auditQuery.isLoading && (auditQuery.data ?? []).length > 0 ? (
            <div className="admin-table-shell">
              <table
                className="admin-table admin-table-compact"
                role="table"
                aria-label="Audit logs table"
              >
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Actor</th>
                    <th>Entity</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {(auditQuery.data ?? []).map((log) => (
                    <tr key={log.id}>
                      <td>
                        <strong>{log.action}</strong>
                      </td>
                      <td>{log.actorEmail}</td>
                      <td>
                        <small className="admin-table-muted">
                          {log.entityType}:{log.entityId}
                        </small>
                      </td>
                      <td>
                        <small className="admin-table-muted">
                          {log.createdAt
                            ? new Date(log.createdAt).toLocaleString("en-BD")
                            : "-"}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {!auditQuery.isLoading && auditQuery.data?.length === 0 ? (
            <div className="admin-empty-state">
              <BarChart3 size={28} />
              <p style={{ margin: 0 }}>No audit logs recorded yet.</p>
            </div>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: Readonly<{ icon: ReactNode; label: string; value: string }>): ReactNode {
  return (
    <Card className="dashboard-card dashboard-metric-card">
      <CardBody>
        <span className="dashboard-metric-icon">{icon}</span>
        <small>{label}</small>
        <strong>{value}</strong>
      </CardBody>
    </Card>
  );
}
