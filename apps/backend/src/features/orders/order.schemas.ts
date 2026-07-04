import { z } from "zod";

import { orderStatuses } from "./order.model.js";

export const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Expected a MongoDB object id");

export const checkoutSchema = z.object({
  guestCartId: z
    .string()
    .trim()
    .min(10)
    .max(64)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .optional(),
  customerName: z.string().trim().min(2).max(140),
  customerEmail: z.string().trim().toLowerCase().email().max(180),
  customerPhone: z.string().trim().min(6).max(40),
  shippingAddress: z.object({
    line1: z.string().trim().min(2).max(220),
    line2: z.string().trim().max(220).optional(),
    area: z.string().trim().min(2).max(140),
    city: z.string().trim().min(2).max(120),
    postalCode: z.string().trim().max(24).optional(),
    country: z.string().trim().min(2).max(80),
  }),
  notes: z.string().trim().max(500).optional(),
  paymentMethod: z.literal("cod").default("cod"),
});

export const trackOrderQuerySchema = z.object({
  email: z.string().trim().toLowerCase().email().max(180).optional(),
});

export const orderIdParamSchema = z.object({
  id: objectIdSchema,
});

export const orderStatusSchema = z.enum(orderStatuses);
