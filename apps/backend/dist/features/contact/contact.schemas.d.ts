import { z } from "zod";
export declare const contactDetailsSchema: z.ZodObject<{
    phone: z.ZodDefault<z.ZodEffects<z.ZodString, string, string>>;
    whatsapp: z.ZodDefault<z.ZodEffects<z.ZodString, string, string>>;
    email: z.ZodDefault<z.ZodEffects<z.ZodString, string, string>>;
    address: z.ZodDefault<z.ZodString>;
    businessHours: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    businessHours: string;
}, {
    email?: string | undefined;
    phone?: string | undefined;
    whatsapp?: string | undefined;
    address?: string | undefined;
    businessHours?: string | undefined;
}>;
export declare const socialLinkSchema: z.ZodObject<{
    platform: z.ZodEnum<["facebook", "instagram", "youtube", "tiktok", "x", "linkedin", "pinterest", "messenger", "telegram", "website"]>;
    url: z.ZodEffects<z.ZodString, string, string>;
    label: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    url: string;
    isActive: boolean;
    platform: "facebook" | "instagram" | "youtube" | "tiktok" | "x" | "linkedin" | "pinterest" | "messenger" | "telegram" | "website";
    sortOrder: number;
    label?: string | undefined;
}, {
    url: string;
    platform: "facebook" | "instagram" | "youtube" | "tiktok" | "x" | "linkedin" | "pinterest" | "messenger" | "telegram" | "website";
    label?: string | undefined;
    isActive?: boolean | undefined;
    sortOrder?: number | undefined;
}>;
export declare const contactMessageCreateSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    subject: z.ZodString;
    message: z.ZodString;
    website: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    message: string;
    name: string;
    email: string;
    subject: string;
    phone?: string | undefined;
    website?: string | undefined;
}, {
    message: string;
    name: string;
    email: string;
    subject: string;
    phone?: string | undefined;
    website?: string | undefined;
}>;
export declare const adminContactMessagesQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<["new", "read", "resolved"]>>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    status?: "new" | "read" | "resolved" | undefined;
    search?: string | undefined;
}, {
    status?: "new" | "read" | "resolved" | undefined;
    limit?: number | undefined;
    search?: string | undefined;
    page?: number | undefined;
}>;
export declare const contactMessageUpdateSchema: z.ZodEffects<z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["new", "read", "resolved"]>>;
    adminNote: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: "new" | "read" | "resolved" | undefined;
    adminNote?: string | undefined;
}, {
    status?: "new" | "read" | "resolved" | undefined;
    adminNote?: string | undefined;
}>, {
    status?: "new" | "read" | "resolved" | undefined;
    adminNote?: string | undefined;
}, {
    status?: "new" | "read" | "resolved" | undefined;
    adminNote?: string | undefined;
}>;
//# sourceMappingURL=contact.schemas.d.ts.map