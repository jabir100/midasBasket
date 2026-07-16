import type { ReactNode } from "react";

import { AdminShell } from "./admin-shell.js";
import { useAdminGuard } from "./use-admin-guard.js";

export function AdminPageShell({
  children,
}: Readonly<{ children: ReactNode }>): ReactNode {
  const { isReady, adminName, navCounts, isLoggingOut, onLogout } =
    useAdminGuard();

  if (!isReady) {
    return null;
  }

  return (
    <AdminShell
      adminName={adminName}
      isLoggingOut={isLoggingOut}
      navCounts={navCounts}
      onLogout={onLogout}
    >
      {children}
    </AdminShell>
  );
}
