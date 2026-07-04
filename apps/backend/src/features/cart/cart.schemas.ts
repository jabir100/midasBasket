import { z } from "zod";

const objectId = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Expected a MongoDB object id");

export const guestCartIdSchema = z
  .string()
  .trim()
  .min(10)
  .max(64)
  .regex(/^[a-zA-Z0-9_-]+$/, "Guest cart id format is invalid");

export const addCartItemSchema = z.object({
  guestCartId: guestCartIdSchema.optional(),
  productId: objectId,
  quantity: z.coerce.number().int().min(1).max(99).default(1),
});

export const updateCartItemSchema = z.object({
  guestCartId: guestCartIdSchema.optional(),
  quantity: z.coerce.number().int().min(1).max(99),
});

export const cartQuerySchema = z.object({
  guestCartId: guestCartIdSchema.optional(),
});

export const couponSchema = z.object({
  guestCartId: guestCartIdSchema.optional(),
  couponCode: z.string().trim().min(3).max(32).toUpperCase().optional(),
});
