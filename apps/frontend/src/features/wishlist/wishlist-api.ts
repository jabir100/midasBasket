import { getStoredAccessToken } from "../auth/auth-api.js";
import { apiClient } from "../../shared/http/api-client.js";

export type WishlistItem = {
  productId: string;
  addedAt: string;
};

type ApiSuccess<TData> = {
  success: true;
  data: TData;
  requestId: string;
};

export async function getWishlist(): Promise<WishlistItem[]> {
  if (!getStoredAccessToken()) {
    return [];
  }

  const response =
    await apiClient.get<ApiSuccess<{ wishlist: { items: WishlistItem[] } }>>(
      "/wishlist",
    );
  return response.data.data.wishlist.items;
}

export async function addWishlistItem(
  productId: string,
): Promise<WishlistItem[]> {
  if (!getStoredAccessToken()) {
    throw new Error("Log in to save products to wishlist.");
  }

  const response = await apiClient.post<
    ApiSuccess<{ wishlist: { items: WishlistItem[] } }>
  >("/wishlist/items", { productId });
  return response.data.data.wishlist.items;
}

export async function removeWishlistItem(
  productId: string,
): Promise<WishlistItem[]> {
  const response = await apiClient.delete<
    ApiSuccess<{ wishlist: { items: WishlistItem[] } }>
  >(`/wishlist/items/${productId}`);
  return response.data.data.wishlist.items;
}
