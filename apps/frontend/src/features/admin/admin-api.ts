import { apiClient } from "../../shared/http/api-client.js";

export type AdminSummary = {
  users: {
    totalUsers: number;
    totalCustomers: number;
    totalAdmins: number;
    blockedUsers: number;
  };
  orders: {
    totalOrders: number;
    recentOrders: number;
    statusBreakdown: Array<{ status: string; count: number }>;
  };
  revenue: {
    currency: string;
    lifetime: number;
    last7Days: number;
  };
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "admin" | "customer";
  status: "active" | "blocked";
  createdAt?: string;
  updatedAt?: string;
};

export type AdminOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  paymentStatus: string;
  total: number;
  currency: string;
  createdAt?: string;
};

export type AuditLog = {
  id: string;
  actorUserId: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: unknown;
  createdAt?: string;
};

type ApiSuccess<TData> = {
  success: true;
  data: TData;
  requestId: string;
  meta?: Record<string, unknown>;
};

export async function getAdminSummary(): Promise<AdminSummary> {
  const response = await apiClient.get<ApiSuccess<AdminSummary>>(
    "/admin/dashboard/summary",
  );
  return response.data.data;
}

export async function listAdminUsers(input?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "blocked";
  role?: "admin" | "customer";
}): Promise<AdminUser[]> {
  const response = await apiClient.get<ApiSuccess<{ users: AdminUser[] }>>(
    "/admin/dashboard/users",
    { params: input },
  );
  return response.data.data.users;
}

export async function updateAdminUser(
  userId: string,
  input: { role?: "admin" | "customer"; status?: "active" | "blocked" },
): Promise<AdminUser> {
  const response = await apiClient.patch<ApiSuccess<{ user: AdminUser }>>(
    `/admin/dashboard/users/${userId}`,
    input,
  );
  return response.data.data.user;
}

export async function listAdminOrders(input?: {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
}): Promise<AdminOrder[]> {
  const response = await apiClient.get<ApiSuccess<{ orders: AdminOrder[] }>>(
    "/admin/dashboard/orders",
    { params: input },
  );
  return response.data.data.orders;
}

export async function updateOrderStatus(
  orderId: string,
  input: { status: string; paymentStatus?: string; note?: string },
): Promise<void> {
  await apiClient.patch(`/admin/dashboard/orders/${orderId}/status`, input);
}

export async function listAuditLogs(input?: {
  page?: number;
  limit?: number;
  action?: string;
}): Promise<AuditLog[]> {
  const response = await apiClient.get<ApiSuccess<{ logs: AuditLog[] }>>(
    "/admin/dashboard/audit-logs",
    { params: input },
  );
  return response.data.data.logs;
}
