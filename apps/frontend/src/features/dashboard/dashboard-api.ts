import { apiClient } from "../../shared/http/api-client.js";

export type DashboardProfile = {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    status: string;
    createdAt?: string;
  };
  summary: {
    ordersCount: number;
    wishlistItems: number;
    addressesCount: number;
  };
};

export type UserAddress = {
  id: string;
  label: string;
  line1: string;
  line2: string | null;
  area: string;
  city: string;
  postalCode: string | null;
  country: string;
  isDefault: boolean;
};

export type NotificationPreferences = {
  emailOrders: boolean;
  emailOffers: boolean;
  smsOrders: boolean;
  pushNotifications: boolean;
};

export type DashboardInvoice = {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  currency: string;
  total: number;
  issuedAt?: string;
};

type ApiSuccess<TData> = {
  success: true;
  data: TData;
  requestId: string;
};

export async function getDashboardProfile(): Promise<DashboardProfile> {
  const response =
    await apiClient.get<ApiSuccess<DashboardProfile>>("/users/me/profile");
  return response.data.data;
}

export async function updateDashboardProfile(input: {
  name?: string;
  phone?: string;
}): Promise<DashboardProfile["user"]> {
  const response = await apiClient.patch<
    ApiSuccess<{ user: DashboardProfile["user"] }>
  >("/users/me/profile", input);
  return response.data.data.user;
}

export async function listUserAddresses(): Promise<UserAddress[]> {
  const response = await apiClient.get<
    ApiSuccess<{ addresses: UserAddress[] }>
  >("/users/me/addresses");
  return response.data.data.addresses;
}

export async function createUserAddress(input: {
  label: string;
  line1: string;
  line2?: string;
  area: string;
  city: string;
  postalCode?: string;
  country: string;
  isDefault?: boolean;
}): Promise<UserAddress> {
  const response = await apiClient.post<ApiSuccess<{ address: UserAddress }>>(
    "/users/me/addresses",
    input,
  );
  return response.data.data.address;
}

export async function deleteUserAddress(addressId: string): Promise<void> {
  await apiClient.delete(`/users/me/addresses/${addressId}`);
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const response = await apiClient.get<
    ApiSuccess<{ notificationPreferences: NotificationPreferences }>
  >("/users/me/notifications");
  return response.data.data.notificationPreferences;
}

export async function updateNotificationPreferences(
  input: Partial<NotificationPreferences>,
): Promise<NotificationPreferences> {
  const response = await apiClient.patch<
    ApiSuccess<{ notificationPreferences: NotificationPreferences }>
  >("/users/me/notifications", input);
  return response.data.data.notificationPreferences;
}

export async function listInvoices(): Promise<DashboardInvoice[]> {
  const response =
    await apiClient.get<ApiSuccess<{ invoices: DashboardInvoice[] }>>(
      "/users/me/invoices",
    );
  return response.data.data.invoices;
}
