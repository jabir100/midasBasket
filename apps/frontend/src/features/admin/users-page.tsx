import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import { Toast } from "@heroui/react";

import { getCurrentUser } from "../auth/auth-api.js";
import { listAdminUsers, updateAdminUser } from "./admin-api.js";
import { AdminPageShell } from "./admin-page-shell.js";
import { UsersPanel } from "./users-panel.js";

export function AdminUsersPage(): ReactNode {
  const queryClient = useQueryClient();
  const [userFilter, setUserFilter] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState("");

  const currentUserQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
  });

  const usersQuery = useQuery({
    queryKey: ["admin", "users", userFilter, userRoleFilter, userStatusFilter],
    queryFn: () =>
      listAdminUsers({
        ...(userFilter ? { search: userFilter } : {}),
        ...(userRoleFilter ? { role: userRoleFilter as "admin" | "customer" } : {}),
        ...(userStatusFilter
          ? { status: userStatusFilter as "active" | "blocked" }
          : {}),
      }),
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
      Toast.toast.success("User status updated");
    },
    onError: (error: Error) => {
      Toast.toast.danger(error.message || "Could not update user status");
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: string;
      role: "admin" | "customer";
    }) => updateAdminUser(userId, { role }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "summary"] });
      Toast.toast.success("User role updated");
    },
    onError: (error: Error) => {
      Toast.toast.danger(error.message || "Could not update user role");
    },
  });

  return (
    <AdminPageShell>
      <UsersPanel
        users={usersQuery.data ?? []}
        isLoading={usersQuery.isLoading}
        isUpdatingStatus={updateUserMutation.isPending}
        isUpdatingRole={updateRoleMutation.isPending}
        currentUserId={currentUserQuery.data?.id}
        search={userFilter}
        roleFilter={userRoleFilter}
        statusFilter={userStatusFilter}
        onSearchChange={setUserFilter}
        onRoleFilterChange={setUserRoleFilter}
        onStatusFilterChange={setUserStatusFilter}
        onToggleStatus={(user) => {
          updateUserMutation.mutate({
            userId: user.id,
            status: user.status === "active" ? "blocked" : "active",
          });
        }}
        onToggleRole={(user) => {
          updateRoleMutation.mutate({
            userId: user.id,
            role: user.role === "admin" ? "customer" : "admin",
          });
        }}
      />
    </AdminPageShell>
  );
}
