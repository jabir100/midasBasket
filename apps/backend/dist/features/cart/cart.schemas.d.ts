import { z } from "zod";
export declare const guestCartIdSchema: z.ZodString;
export declare const addCartItemSchema: z.ZodEffects<z.ZodObject<{
    guestCartId: z.ZodOptional<z.ZodString>;
    productId: z.ZodString;
    quantity: z.ZodDefault<z.ZodNumber>;
    size: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    productId: string;
    quantity: number;
    size?: string | undefined;
    color?: string | undefined;
    guestCartId?: string | undefined;
}, {
    productId: string;
    quantity?: number | undefined;
    size?: string | undefined;
    color?: string | undefined;
    guestCartId?: string | undefined;
}>, {
    productId: string;
    quantity: number;
    size?: string | undefined;
    color?: string | undefined;
    guestCartId?: string | undefined;
}, {
    productId: string;
    quantity?: number | undefined;
    size?: string | undefined;
    color?: string | undefined;
    guestCartId?: string | undefined;
}>;
export declare const updateCartItemSchema: z.ZodObject<{
    guestCartId: z.ZodOptional<z.ZodString>;
    quantity: z.ZodNumber;
    size: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    quantity: number;
    size?: string | undefined;
    color?: string | undefined;
    guestCartId?: string | undefined;
}, {
    quantity: number;
    size?: string | undefined;
    color?: string | undefined;
    guestCartId?: string | undefined;
}>;
export declare const cartQuerySchema: z.ZodObject<{
    guestCartId: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    size?: string | undefined;
    color?: string | undefined;
    guestCartId?: string | undefined;
}, {
    size?: string | undefined;
    color?: string | undefined;
    guestCartId?: string | undefined;
}>;
export declare const couponSchema: z.ZodObject<{
    guestCartId: z.ZodOptional<z.ZodString>;
    couponCode: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    guestCartId?: string | undefined;
    couponCode?: string | undefined;
}, {
    guestCartId?: string | undefined;
    couponCode?: string | undefined;
}>;
//# sourceMappingURL=cart.schemas.d.ts.map