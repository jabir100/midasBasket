import { z } from "zod";
export declare const objectIdSchema: z.ZodString;
export declare const checkoutSchema: z.ZodObject<{
    guestCartId: z.ZodOptional<z.ZodString>;
    customerName: z.ZodString;
    customerEmail: z.ZodString;
    customerPhone: z.ZodString;
    shippingAddress: z.ZodObject<{
        line1: z.ZodString;
        line2: z.ZodOptional<z.ZodString>;
        area: z.ZodString;
        city: z.ZodString;
        postalCode: z.ZodOptional<z.ZodString>;
        country: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        line1: string;
        area: string;
        city: string;
        country: string;
        line2?: string | undefined;
        postalCode?: string | undefined;
    }, {
        line1: string;
        area: string;
        city: string;
        country: string;
        line2?: string | undefined;
        postalCode?: string | undefined;
    }>;
    notes: z.ZodOptional<z.ZodString>;
    paymentMethod: z.ZodDefault<z.ZodLiteral<"cod">>;
}, "strip", z.ZodTypeAny, {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: {
        line1: string;
        area: string;
        city: string;
        country: string;
        line2?: string | undefined;
        postalCode?: string | undefined;
    };
    paymentMethod: "cod";
    guestCartId?: string | undefined;
    notes?: string | undefined;
}, {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: {
        line1: string;
        area: string;
        city: string;
        country: string;
        line2?: string | undefined;
        postalCode?: string | undefined;
    };
    guestCartId?: string | undefined;
    notes?: string | undefined;
    paymentMethod?: "cod" | undefined;
}>;
export declare const trackOrderQuerySchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
}, {
    email?: string | undefined;
}>;
export declare const orderIdParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const orderStatusSchema: z.ZodEnum<["placed", "confirmed", "packed", "shipped", "out-for-delivery", "delivered", "cancelled"]>;
//# sourceMappingURL=order.schemas.d.ts.map