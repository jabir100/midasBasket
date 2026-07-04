import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BarChart3, Shield, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import {
  getAdminSummary,
  listAdminOrders,
  listAdminUsers,
  listAuditLogs,
  updateAdminUser,
  updateOrderStatus,
} from "./admin-api.js";

const statusOptions = [
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "out-for-delivery",
  "delivered",
  "cancelled",
] as const;

export function AdminDashboardPage(): ReactNode {
  const queryClient = useQueryClient();
  const [userFilter, setUserFilter] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("");

  const summaryQuery = useQuery({
    queryKey: ["admin", "summary"],
    queryFn: getAdminSummary,
  });
  const usersQuery = useQuery({
    queryKey: ["admin", "users", userFilter],
    queryFn: () =>
      listAdminUsers(userFilter ? { search: userFilter } : undefined),
  });
  const ordersQuery = useQuery({
    queryKey: ["admin", "orders", orderStatusFilter],
    queryFn: () =>
      listAdminOrders(
        orderStatusFilter ? { status: orderStatusFilter } : undefined,
      ),
  });
  const auditQuery = useQuery({
    queryKey: ["admin", "audit"],
    queryFn: () => listAuditLogs({ limit: 10 }),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: "active" | "blocked";
    }) => updateAdminUser(userId, { status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "summary"] });
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      updateOrderStatus(orderId, { status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "summary"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "audit"] });
    },
  });

  return (
    <main className="page-shell admin-dashboard-page">
      <section className="section-heading catalog-heading">
        <span className="eyebrow">Phase 10</span>
        <h1>Admin dashboard</h1>
        <p>
          Review operational analytics, manage customer accounts, control order
          lifecycle, and inspect audit activity.
        </p>
      </section>

      {summaryQuery.data ? (
        <section className="admin-summary-grid">
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
            icon={<Shield size={18} />}
            label="Blocked users"
            value={summaryQuery.data.users.blockedUsers.toString()}
          />
        </section>
      ) : null}

      <section className="admin-grid-main">
        <Card className="dashboard-card">
          <CardBody>
            <div className="admin-card-head">
              <h2>User management</h2>
              <input
                placeholder="Search users"
                value={userFilter}
                onChange={(event) => {
                  setUserFilter(event.target.value);
                }}
              />
            </div>
            <ul className="admin-list">
              {(usersQuery.data ?? []).map((user) => (
                <li key={user.id}>
                  <div>
                    <strong>{user.name}</strong>
                    <small>
                      {user.email} · {user.role} · {user.status}
                    </small>
                  </div>
                  <Button
                    tone={user.status === "blocked" ? "secondary" : "ghost"}
                    disabled={updateUserMutation.isPending}
                    onClick={() => {
                      updateUserMutation.mutate({
                        userId: user.id,
                        status: user.status === "active" ? "blocked" : "active",
                      });
                    }}
                  >
                    {user.status === "active" ? "Block" : "Unblock"}
                  </Button>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card className="dashboard-card">
          <CardBody>
            <div className="admin-card-head">
              <h2>Order management</h2>
              <select
                aria-label="Filter orders by status"
                value={orderStatusFilter}
                onChange={(event) => {
                  setOrderStatusFilter(event.target.value);
                }}
              >
                <option value="">All statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <ul className="admin-list">
              {(ordersQuery.data ?? []).map((order) => (
                <li key={order.id}>
                  <div>
                    <strong>{order.orderNumber}</strong>
                    <small>
                      {order.customerName} · {order.status} · {order.currency}{" "}
                      {order.total.toLocaleString("en-BD")}
                    </small>
                  </div>
                  <select
                    aria-label={`Update status for ${order.orderNumber}`}
                    value={order.status}
                    onChange={(event) => {
                      updateOrderMutation.mutate({
                        orderId: order.id,
                        status: event.target.value,
                      });
                    }}
                    disabled={updateOrderMutation.isPending}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </section>

      <Card className="dashboard-card admin-audit-card">
        <CardBody>
          <h2>Recent audit logs</h2>
          <ul className="admin-list">
            {(auditQuery.data ?? []).map((log) => (
              <li key={log.id}>
                <div>
                  <strong>{log.action}</strong>
                  <small>
                    {log.actorEmail} · {log.entityType}:{log.entityId}
                  </small>
                </div>
                <small>
                  {log.createdAt
                    ? new Date(log.createdAt).toLocaleString("en-BD")
                    : "-"}
                </small>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </main>
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
