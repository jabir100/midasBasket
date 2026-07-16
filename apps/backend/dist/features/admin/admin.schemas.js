import { z } from "zod";
import { orderStatuses } from "../orders/order.model.js";
const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
});
export const objectIdParamSchema = z.object({
    id: z
        .string()
        .trim()
        .regex(/^[a-f\d]{24}$/i, "Expected a MongoDB object id"),
});
export const adminUsersQuerySchema = paginationSchema.extend({
    search: z.string().trim().min(1).max(120).optional(),
    role: z.enum(["admin", "customer"]).optional(),
    status: z.enum(["active", "blocked"]).optional(),
});
export const adminOrdersQuerySchema = paginationSchema.extend({
    status: z.enum(orderStatuses).optional(),
    paymentStatus: z.enum(["pending", "paid", "failed"]).optional(),
    search: z.string().trim().min(1).max(120).optional(),
});
export const adminUserUpdateSchema = z
    .object({
    role: z.enum(["admin", "customer"]).optional(),
    status: z.enum(["active", "blocked"]).optional(),
})
    .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
});
export const orderStatusUpdateSchema = z.object({
    status: z.enum(orderStatuses),
    paymentStatus: z.enum(["pending", "paid", "failed"]).optional(),
    note: z.string().trim().max(400).optional(),
});
export const auditLogsQuerySchema = paginationSchema.extend({
    action: z.string().trim().min(1).max(120).optional(),
    actorEmail: z.string().trim().toLowerCase().email().optional(),
});
//# sourceMappingURL=admin.schemas.js.map