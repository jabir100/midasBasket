import { z } from "zod";
export declare const objectIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const adminUsersQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
} & {
    search: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["admin", "customer"]>>;
    status: z.ZodOptional<z.ZodEnum<["active", "blocked"]>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    status?: "active" | "blocked" | undefined;
    role?: "admin" | "customer" | undefined;
    search?: string | undefined;
}, {
    status?: "active" | "blocked" | undefined;
    limit?: number | undefined;
    role?: "admin" | "customer" | undefined;
    search?: string | undefined;
    page?: number | undefined;
}>;
export declare const adminOrdersQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
} & {
    status: z.ZodOptional<z.ZodEnum<["placed", "confirmed", "packed", "shipped", "out-for-delivery", "delivered", "cancelled"]>>;
    paymentStatus: z.ZodOptional<z.ZodEnum<["pending", "paid", "failed"]>>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    status?: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled" | undefined;
    search?: string | undefined;
    paymentStatus?: "pending" | "paid" | "failed" | undefined;
}, {
    status?: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled" | undefined;
    limit?: number | undefined;
    search?: string | undefined;
    paymentStatus?: "pending" | "paid" | "failed" | undefined;
    page?: number | undefined;
}>;
export declare const adminUserUpdateSchema: z.ZodEffects<z.ZodObject<{
    role: z.ZodOptional<z.ZodEnum<["admin", "customer"]>>;
    status: z.ZodOptional<z.ZodEnum<["active", "blocked"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "active" | "blocked" | undefined;
    role?: "admin" | "customer" | undefined;
}, {
    status?: "active" | "blocked" | undefined;
    role?: "admin" | "customer" | undefined;
}>, {
    status?: "active" | "blocked" | undefined;
    role?: "admin" | "customer" | undefined;
}, {
    status?: "active" | "blocked" | undefined;
    role?: "admin" | "customer" | undefined;
}>;
export declare const orderStatusUpdateSchema: z.ZodObject<{
    status: z.ZodEnum<["placed", "confirmed", "packed", "shipped", "out-for-delivery", "delivered", "cancelled"]>;
    paymentStatus: z.ZodOptional<z.ZodEnum<["pending", "paid", "failed"]>>;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
    note?: string | undefined;
    paymentStatus?: "pending" | "paid" | "failed" | undefined;
}, {
    status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
    note?: string | undefined;
    paymentStatus?: "pending" | "paid" | "failed" | undefined;
}>;
export declare const auditLogsQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
} & {
    action: z.ZodOptional<z.ZodString>;
    actorEmail: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    actorEmail?: string | undefined;
    action?: string | undefined;
}, {
    limit?: number | undefined;
    actorEmail?: string | undefined;
    action?: string | undefined;
    page?: number | undefined;
}>;
//# sourceMappingURL=admin.schemas.d.ts.map