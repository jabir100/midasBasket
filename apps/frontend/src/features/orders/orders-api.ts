import { getGuestCartScope } from "../cart/cart-api.js";
import { getStoredAccessToken } from "../auth/auth-api.js";
import { apiClient } from "../../shared/http/api-client.js";

export type OrderSummary = {
  id: string;
  orderNumber: string;
  status: string;
  statusTimeline: Array<{
    status: string;
    timestamp: string;
    updatedBy: string;
    note?: string | null;
  }>;
  createdAt?: string;
  paymentMethod: string;
  paymentStatus: string;
  totals: {
    subTotal: number;
    shippingFee: number;
    discountTotal: number;
    total: number;
    currency: string;
  };
  items: Array<{
    productId: string;
    title: string;
    slug: string;
    imageUrl?: string | null;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
};

export type CheckoutInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    area: string;
    city: string;
    postalCode?: string;
    country: string;
  };
  notes?: string;
  paymentMethod: "cod";
};

type ApiSuccess<TData> = {
  success: true;
  data: TData;
  requestId: string;
};

export async function checkoutOrder(
  input: CheckoutInput,
): Promise<OrderSummary> {
  const response = await apiClient.post<ApiSuccess<{ order: OrderSummary }>>(
    "/orders/checkout",
    {
      ...input,
      ...getGuestCartScope(),
    },
  );

  return response.data.data.order;
}

export async function listMyOrders(): Promise<OrderSummary[]> {
  if (!getStoredAccessToken()) {
    return [];
  }

  const response =
    await apiClient.get<ApiSuccess<{ orders: OrderSummary[] }>>("/orders/me");

  return response.data.data.orders;
}

export async function getMyOrder(id: string): Promise<OrderSummary> {
  const response = await apiClient.get<ApiSuccess<{ order: OrderSummary }>>(
    `/orders/me/${id}`,
  );

  return response.data.data.order;
}

export async function trackOrder(
  orderNumber: string,
  email?: string,
): Promise<{
  orderNumber: string;
  status: string;
  statusTimeline: Array<{
    status: string;
    timestamp: string;
    updatedBy: string;
    note?: string | null;
  }>;
  createdAt: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
}> {
  const response = await apiClient.get<
    ApiSuccess<{
      order: {
        orderNumber: string;
        status: string;
        statusTimeline: Array<{
          status: string;
          timestamp: string;
          updatedBy: string;
          note?: string | null;
        }>;
        createdAt: string;
        total: number;
        paymentMethod: string;
        paymentStatus: string;
      };
    }>
  >(`/orders/track/${orderNumber}`, {
    params: email ? { email } : undefined,
  });

  return response.data.data.order;
}
