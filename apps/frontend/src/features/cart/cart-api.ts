import { getStoredAccessToken } from "../auth/auth-api.js";
import { apiClient } from "../../shared/http/api-client.js";

const guestCartStorageKey = "midas_guest_cart_id";

export type CartItem = {
  productId: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type CartPayload = {
  id: string | null;
  guestCartId: string | null;
  couponCode: string | null;
  currency: string;
  items: CartItem[];
  summary: {
    itemCount: number;
    subTotal: number;
    discountTotal: number;
    total: number;
  };
};

type ApiSuccess<TData> = {
  success: true;
  data: TData;
  requestId: string;
};

export async function getCart(): Promise<CartPayload> {
  const response = await apiClient.get<ApiSuccess<{ cart: CartPayload }>>(
    "/cart",
    {
      params: getGuestCartScope(),
    },
  );
  return response.data.data.cart;
}

export async function addCartItem(input: {
  productId: string;
  quantity?: number;
}): Promise<CartPayload> {
  const response = await apiClient.post<ApiSuccess<{ cart: CartPayload }>>(
    "/cart/items",
    {
      ...input,
      ...getGuestCartScope(),
    },
  );
  return response.data.data.cart;
}

export async function updateCartItem(input: {
  productId: string;
  quantity: number;
}): Promise<CartPayload> {
  const response = await apiClient.patch<ApiSuccess<{ cart: CartPayload }>>(
    `/cart/items/${input.productId}`,
    {
      quantity: input.quantity,
      ...getGuestCartScope(),
    },
  );
  return response.data.data.cart;
}

export async function removeCartItem(productId: string): Promise<CartPayload> {
  const response = await apiClient.delete<ApiSuccess<{ cart: CartPayload }>>(
    `/cart/items/${productId}`,
    {
      params: getGuestCartScope(),
    },
  );
  return response.data.data.cart;
}

export async function clearCart(): Promise<CartPayload | null> {
  const response = await apiClient.delete<
    ApiSuccess<{ cart: CartPayload | null }>
  >("/cart", {
    params: getGuestCartScope(),
  });
  return response.data.data.cart;
}

export async function setCartCoupon(couponCode: string): Promise<CartPayload> {
  const response = await apiClient.put<ApiSuccess<{ cart: CartPayload }>>(
    "/cart/coupon",
    {
      couponCode,
      ...getGuestCartScope(),
    },
  );
  return response.data.data.cart;
}

export function getGuestCartScope(): { guestCartId?: string } {
  if (getStoredAccessToken()) {
    return {};
  }

  return { guestCartId: getOrCreateGuestCartId() };
}

function getOrCreateGuestCartId(): string {
  if (typeof window === "undefined") {
    return "guest-server-render";
  }

  const existing = window.localStorage.getItem(guestCartStorageKey);

  if (existing) {
    return existing;
  }

  const generated =
    typeof window.crypto.randomUUID === "function"
      ? `guest_${window.crypto.randomUUID()}`
      : `guest_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  window.localStorage.setItem(guestCartStorageKey, generated);
  return generated;
}
