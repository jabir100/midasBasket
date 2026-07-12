import { Ban, CircleCheck, Search, Users } from "lucide-react";
import type { ReactNode } from "react";
import { Skeleton } from "@heroui/react";

import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import type { AdminUser } from "./admin-api.js";
import { AdminSearchInput, AdminTableSelect } from "./admin-form-controls.js";
import { UserRoleBadge, UserStatusBadge } from "./status-badge.js";

const roleOptions = [
  { id: "", label: "All roles" },
  { id: "admin", label: "Admin" },
  { id: "customer", label: "Customer" },
];

const statusOptions = [
  { id: "", label: "All statuses" },
  { id: "active", label: "Active" },
  { id: "blocked", label: "Blocked" },
];

export function UsersPanel({
  isLoading,
  isUpdatingStatus,
  onRoleFilterChange,
  onSearchChange,
  onStatusFilterChange,
  onToggleStatus,
  roleFilter,
  search,
  statusFilter,
  users,
}: Readonly<{
  isLoading: boolean;
  isUpdatingStatus: boolean;
  onRoleFilterChange: (role: string) => void;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (status: string) => void;
  onToggleStatus: (user: AdminUser) => void;
  roleFilter: string;
  search: string;
  statusFilter: string;
  users: AdminUser[];
}>): ReactNode {
  return (
    <div className="dashboard-pane-content">
      <div className="section-heading">
        <div>
          <h3 className="admin-section-title">User management</h3>
          <p className="admin-section-copy">
            View, search, block, or unblock registered customers.
          </p>
        </div>
      </div>

      <Card className="dashboard-card" style={{ marginTop: "1.5rem" }}>
        <CardBody>
          <div className="admin-toolbar">
            <div className="admin-toolbar-search">
              <AdminSearchInput
                icon={<Search size={16} />}
                placeholder="Search by name, email, or phone"
                value={search}
                onChange={onSearchChange}
              />
            </div>
            <div className="admin-toolbar-filter">
              <AdminTableSelect
                label="Role"
                placeholder="All roles"
                value={roleFilter}
                options={roleOptions}
                onChange={onRoleFilterChange}
              />
            </div>
            <div className="admin-toolbar-filter">
              <AdminTableSelect
                label="Status"
                placeholder="All statuses"
                value={statusFilter}
                options={statusOptions}
                onChange={onStatusFilterChange}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="admin-skeleton-stack">
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ) : null}

          {!isLoading && users.length > 0 ? (
            <div className="admin-table-shell">
              <table
                className="admin-table admin-table-compact"
                role="table"
                aria-label="Users table"
              >
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <strong>{user.name}</strong>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone ?? "—"}</td>
                      <td>
                        <UserRoleBadge role={user.role} />
                      </td>
                      <td>
                        <UserStatusBadge status={user.status} />
                      </td>
                      <td>
                        <small className="admin-table-muted">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                "en-BD",
                                { day: "2-digit", month: "short", year: "numeric" },
                              )
                            : "—"}
                        </small>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <Button
                            iconOnly
                            tone={user.status === "blocked" ? "secondary" : "ghost"}
                            title={
                              user.status === "active"
                                ? "Block user"
                                : "Unblock user"
                            }
                            disabled={isUpdatingStatus}
                            onClick={() => {
                              onToggleStatus(user);
                            }}
                            startContent={
                              user.status === "active" ? (
                                <Ban size={16} style={{ color: "var(--color-midas-red)" }} />
                              ) : (
                                <CircleCheck size={16} />
                              )
                            }
                          >
                            {user.status === "active" ? "Block" : "Unblock"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {!isLoading && users.length === 0 ? (
            <div className="admin-empty-state">
              <Users size={28} />
              <p style={{ margin: 0 }}>No users match the current filters.</p>
            </div>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}
