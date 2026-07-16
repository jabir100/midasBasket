import { z } from "zod";
export declare const userProfileUpdateSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    phone?: string | undefined;
}, {
    name?: string | undefined;
    phone?: string | undefined;
}>, {
    name?: string | undefined;
    phone?: string | undefined;
}, {
    name?: string | undefined;
    phone?: string | undefined;
}>;
export declare const userAddressSchema: z.ZodObject<{
    label: z.ZodDefault<z.ZodString>;
    line1: z.ZodString;
    line2: z.ZodOptional<z.ZodString>;
    area: z.ZodString;
    city: z.ZodString;
    postalCode: z.ZodOptional<z.ZodString>;
    country: z.ZodDefault<z.ZodString>;
    isDefault: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    label: string;
    line1: string;
    area: string;
    city: string;
    country: string;
    line2?: string | undefined;
    postalCode?: string | undefined;
    isDefault?: boolean | undefined;
}, {
    line1: string;
    area: string;
    city: string;
    label?: string | undefined;
    line2?: string | undefined;
    postalCode?: string | undefined;
    country?: string | undefined;
    isDefault?: boolean | undefined;
}>;
export declare const userAddressUpdateSchema: z.ZodEffects<z.ZodObject<{
    label: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    line1: z.ZodOptional<z.ZodString>;
    line2: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    area: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    postalCode: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    country: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    isDefault: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    label?: string | undefined;
    line1?: string | undefined;
    line2?: string | undefined;
    area?: string | undefined;
    city?: string | undefined;
    postalCode?: string | undefined;
    country?: string | undefined;
    isDefault?: boolean | undefined;
}, {
    label?: string | undefined;
    line1?: string | undefined;
    line2?: string | undefined;
    area?: string | undefined;
    city?: string | undefined;
    postalCode?: string | undefined;
    country?: string | undefined;
    isDefault?: boolean | undefined;
}>, {
    label?: string | undefined;
    line1?: string | undefined;
    line2?: string | undefined;
    area?: string | undefined;
    city?: string | undefined;
    postalCode?: string | undefined;
    country?: string | undefined;
    isDefault?: boolean | undefined;
}, {
    label?: string | undefined;
    line1?: string | undefined;
    line2?: string | undefined;
    area?: string | undefined;
    city?: string | undefined;
    postalCode?: string | undefined;
    country?: string | undefined;
    isDefault?: boolean | undefined;
}>;
export declare const userAddressIdParamSchema: z.ZodObject<{
    addressId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    addressId: string;
}, {
    addressId: string;
}>;
export declare const notificationPreferencesUpdateSchema: z.ZodEffects<z.ZodObject<{
    emailOrders: z.ZodOptional<z.ZodBoolean>;
    emailOffers: z.ZodOptional<z.ZodBoolean>;
    smsOrders: z.ZodOptional<z.ZodBoolean>;
    pushNotifications: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    emailOrders?: boolean | undefined;
    emailOffers?: boolean | undefined;
    smsOrders?: boolean | undefined;
    pushNotifications?: boolean | undefined;
}, {
    emailOrders?: boolean | undefined;
    emailOffers?: boolean | undefined;
    smsOrders?: boolean | undefined;
    pushNotifications?: boolean | undefined;
}>, {
    emailOrders?: boolean | undefined;
    emailOffers?: boolean | undefined;
    smsOrders?: boolean | undefined;
    pushNotifications?: boolean | undefined;
}, {
    emailOrders?: boolean | undefined;
    emailOffers?: boolean | undefined;
    smsOrders?: boolean | undefined;
    pushNotifications?: boolean | undefined;
}>;
//# sourceMappingURL=user.schemas.d.ts.map