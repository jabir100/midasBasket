import { z } from "zod";

const objectId = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Expected a MongoDB object id");

export const addWishlistItemSchema = z.object({
  productId: objectId,
});
