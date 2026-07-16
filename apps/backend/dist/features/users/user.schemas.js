import { z } from "zod";
export const userProfileUpdateSchema = z
    .object({
    name: z.string().trim().min(2).max(120).optional(),
    phone: z.string().trim().min(6).max(40).optional(),
})
    .refine((value) => Object.keys(value).length > 0, {
    message: "At least one profile field is required",
});
export const userAddressSchema = z.object({
    label: z.string().trim().min(2).max(60).default("Home"),
    line1: z.string().trim().min(2).max(220),
    line2: z.string().trim().max(220).optional(),
    area: z.string().trim().min(2).max(140),
    city: z.string().trim().min(2).max(120),
    postalCode: z.string().trim().max(24).optional(),
    country: z.string().trim().min(2).max(80).default("Bangladesh"),
    isDefault: z.boolean().optional(),
});
export const userAddressUpdateSchema = userAddressSchema
    .partial()
    .refine((value) => Object.keys(value).length > 0, {
    message: "At least one address field is required",
});
export const userAddressIdParamSchema = z.object({
    addressId: z
        .string()
        .trim()
        .regex(/^[a-f\d]{24}$/i, "Invalid address id"),
});
export const notificationPreferencesUpdateSchema = z
    .object({
    emailOrders: z.boolean().optional(),
    emailOffers: z.boolean().optional(),
    smsOrders: z.boolean().optional(),
    pushNotifications: z.boolean().optional(),
})
    .refine((value) => Object.keys(value).length > 0, {
    message: "At least one preference is required",
});
//# sourceMappingURL=user.schemas.js.map