import { z } from "zod";

import { contactMessageStatuses, socialPlatforms } from "./contact.model.js";

const phonePattern = /^\+?[\d\s()-]{6,30}$/;

/* Optional fields accept "" so the admin can clear a value. */
const optionalPhone = z
  .string()
  .trim()
  .max(30)
  .refine((value) => value === "" || phonePattern.test(value), {
    message: "Enter a valid phone number",
  });

const optionalEmail = z
  .string()
  .trim()
  .toLowerCase()
  .max(180)
  .refine((value) => value === "" || z.string().email().safeParse(value).success, {
    message: "Enter a valid email address",
  });

/* Only http(s) links are rendered as hrefs on the storefront. */
const httpUrl = z
  .string()
  .trim()
  .max(500)
  .url()
  .refine((value) => /^https?:\/\//i.test(value), {
    message: "Link must start with http:// or https://",
  });

export const contactDetailsSchema = z.object({
  phone: optionalPhone.default(""),
  whatsapp: optionalPhone.default(""),
  email: optionalEmail.default(""),
  address: z.string().trim().max(300).default(""),
  businessHours: z.string().trim().max(160).default(""),
});

export const socialLinkSchema = z.object({
  platform: z.enum(socialPlatforms),
  url: httpUrl,
  label: z.string().trim().max(60).optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const contactMessageCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(180),
  phone: optionalPhone.optional(),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(5000),
  /* Honeypot: hidden from people, filled in by naive bots. */
  website: z.string().max(200).optional(),
});

export const adminContactMessagesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  status: z.enum(contactMessageStatuses).optional(),
  search: z.string().trim().min(1).max(120).optional(),
});

export const contactMessageUpdateSchema = z
  .object({
    status: z.enum(contactMessageStatuses).optional(),
    adminNote: z.string().trim().max(2000).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });
