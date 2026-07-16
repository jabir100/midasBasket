import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import {
  getCurrentUser,
  getStoredAccessToken,
  logoutCustomer,
} from "../auth/auth-api.js";
import {
  getAdminCarouselSlides,
  listAdminBrands,
  listAdminCategories,
  listAdminOrders,
  listAdminProducts,
  listAdminUsers,
} from "./admin-api.js";
import type { AdminNavCounts } from "./admin-shell.js";

export function useAdminGuard(): {
  isAdmin: boolean;
  isReady: boolean;
  adminName: string;
  navCounts: AdminNavCounts;
  isLoggingOut: boolean;
  onLogout: () => void;
} {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const token = getStoredAccessToken();

  const userQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (!token) {
      void navigate({ to: "/login" });
    } else if (userQuery.data && userQuery.data.role !== "admin") {
      void navigate({ to: "/" });
    }
  }, [token, userQuery.data, navigate]);

  const isAdmin = token ? userQuery.data?.role === "admin" : false;

  const productsQuery = useQuery({
    queryKey: ["admin", "products"],
    queryFn: listAdminProducts,
    enabled: isAdmin,
  });
  const categoriesQuery = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: listAdminCategories,
    enabled: isAdmin,
  });
  const brandsQuery = useQuery({
    queryKey: ["admin", "brands"],
    queryFn: listAdminBrands,
    enabled: isAdmin,
  });
  const carouselQuery = useQuery({
    queryKey: ["admin", "carousel"],
    queryFn: getAdminCarouselSlides,
    enabled: isAdmin,
  });
  const usersQuery = useQuery({
    queryKey: ["admin", "users", "", "", ""],
    queryFn: () => listAdminUsers(),
    enabled: isAdmin,
  });
  const ordersQuery = useQuery({
    queryKey: ["admin", "orders", "", "", ""],
    queryFn: () => listAdminOrders(),
    enabled: isAdmin,
  });

  const logoutMutation = useMutation({
    mutationFn: logoutCustomer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      window.location.href = "/login";
    },
  });

  const navCounts: AdminNavCounts = {
    products: (productsQuery.data ?? []).length,
    categories: (categoriesQuery.data ?? []).length,
    brands: (brandsQuery.data ?? []).length,
    homepage: (carouselQuery.data ?? []).length,
    users: (usersQuery.data ?? []).length,
    orders: (ordersQuery.data ?? []).length,
  };

  return {
    isAdmin,
    isReady: Boolean(token) && !userQuery.isLoading && isAdmin,
    adminName: userQuery.data?.name ?? "",
    navCounts,
    isLoggingOut: logoutMutation.isPending,
    onLogout: () => {
      logoutMutation.mutate();
    },
  };
}
