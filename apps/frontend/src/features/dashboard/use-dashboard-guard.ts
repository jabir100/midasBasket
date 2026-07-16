import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { getStoredAccessToken, logoutCustomer } from "../auth/auth-api.js";

export function useDashboardGuard(): {
  isReady: boolean;
  isLoggingOut: boolean;
  onLogout: () => void;
} {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const token = getStoredAccessToken();

  useEffect(() => {
    if (!token) {
      void navigate({ to: "/login" });
    }
  }, [token, navigate]);

  const logoutMutation = useMutation({
    mutationFn: logoutCustomer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      window.location.href = "/login";
    },
  });

  return {
    isReady: Boolean(token),
    isLoggingOut: logoutMutation.isPending,
    onLogout: () => {
      logoutMutation.mutate();
    },
  };
}
