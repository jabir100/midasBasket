import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { getDashboardProfile } from "./dashboard-api.js";
import { DashboardShell } from "./dashboard-shell.js";
import { useDashboardGuard } from "./use-dashboard-guard.js";

export function DashboardPageShell({
  children,
}: Readonly<{ children: ReactNode }>): ReactNode {
  const { isReady, isLoggingOut, onLogout } = useDashboardGuard();

  const profileQuery = useQuery({
    queryKey: ["dashboard", "profile"],
    queryFn: getDashboardProfile,
    enabled: isReady,
  });

  if (!isReady) {
    return null;
  }

  return (
    <DashboardShell
      customerName={profileQuery.data?.user.name}
      isLoggingOut={isLoggingOut}
      onLogout={onLogout}
    >
      {children}
    </DashboardShell>
  );
}
