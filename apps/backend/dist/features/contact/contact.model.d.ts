import { Schema, type InferSchemaType } from "mongoose";
export declare const socialPlatforms: readonly ["facebook", "instagram", "youtube", "tiktok", "x", "linkedin", "pinterest", "messenger", "telegram", "website"];
export type SocialPlatform = (typeof socialPlatforms)[number];
export declare const contactMessageStatuses: readonly ["new", "read", "resolved"];
export type ContactMessageStatus = (typeof contactMessageStatuses)[number];
declare const contactDetailsSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    businessHours: string;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    businessHours: string;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    businessHours: string;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
declare const socialLinkSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    label: string;
    url: string;
    isActive: boolean;
    platform: "facebook" | "instagram" | "youtube" | "tiktok" | "x" | "linkedin" | "pinterest" | "messenger" | "telegram" | "website";
    sortOrder: number;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    label: string;
    url: string;
    isActive: boolean;
    platform: "facebook" | "instagram" | "youtube" | "tiktok" | "x" | "linkedin" | "pinterest" | "messenger" | "telegram" | "website";
    sortOrder: number;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    label: string;
    url: string;
    isActive: boolean;
    platform: "facebook" | "instagram" | "youtube" | "tiktok" | "x" | "linkedin" | "pinterest" | "messenger" | "telegram" | "website";
    sortOrder: number;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
declare const contactMessageSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    message: string;
    status: "new" | "read" | "resolved";
    name: string;
    email: string;
    subject: string;
    adminNote: string;
    userId?: import("mongoose").Types.ObjectId | null;
    phone?: string | null;
    readAt?: NativeDate | null;
    ipAddress?: string | null;
    userAgent?: string | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    message: string;
    status: "new" | "read" | "resolved";
    name: string;
    email: string;
    subject: string;
    adminNote: string;
    userId?: import("mongoose").Types.ObjectId | null;
    phone?: string | null;
    readAt?: NativeDate | null;
    ipAddress?: string | null;
    userAgent?: string | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    message: string;
    status: "new" | "read" | "resolved";
    name: string;
    email: string;
    subject: string;
    adminNote: string;
    userId?: import("mongoose").Types.ObjectId | null;
    phone?: string | null;
    readAt?: NativeDate | null;
    ipAddress?: string | null;
    userAgent?: string | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export type ContactDetailsDocument = InferSchemaType<typeof contactDetailsSchema>;
export type SocialLinkDocument = InferSchemaType<typeof socialLinkSchema>;
export type ContactMessageDocument = InferSchemaType<typeof contactMessageSchema>;
export declare const ContactDetailsModel: import("mongoose").Model<{
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    businessHours: string;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    businessHours: string;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    businessHours: string;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    businessHours: string;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    businessHours: string;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    businessHours: string;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export declare const SocialLinkModel: import("mongoose").Model<{
    label: string;
    url: string;
    isActive: boolean;
    platform: "facebook" | "instagram" | "youtube" | "tiktok" | "x" | "linkedin" | "pinterest" | "messenger" | "telegram" | "website";
    sortOrder: number;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    label: string;
    url: string;
    isActive: boolean;
    platform: "facebook" | "instagram" | "youtube" | "tiktok" | "x" | "linkedin" | "pinterest" | "messenger" | "telegram" | "website";
    sortOrder: number;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    label: string;
    url: string;
    isActive: boolean;
    platform: "facebook" | "instagram" | "youtube" | "tiktok" | "x" | "linkedin" | "pinterest" | "messenger" | "telegram" | "website";
    sortOrder: number;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    label: string;
    url: string;
    isActive: boolean;
    platform: "facebook" | "instagram" | "youtube" | "tiktok" | "x" | "linkedin" | "pinterest" | "messenger" | "telegram" | "website";
    sortOrder: number;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    label: string;
    url: string;
    isActive: boolean;
    platform: "facebook" | "instagram" | "youtube" | "tiktok" | "x" | "linkedin" | "pinterest" | "messenger" | "telegram" | "website";
    sortOrder: number;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    label: string;
    url: string;
    isActive: boolean;
    platform: "facebook" | "instagram" | "youtube" | "tiktok" | "x" | "linkedin" | "pinterest" | "messenger" | "telegram" | "website";
    sortOrder: number;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export declare const ContactMessageModel: import("mongoose").Model<{
    message: string;
    status: "new" | "read" | "resolved";
    name: string;
    email: string;
    subject: string;
    adminNote: string;
    userId?: import("mongoose").Types.ObjectId | null;
    phone?: string | null;
    readAt?: NativeDate | null;
    ipAddress?: string | null;
    userAgent?: string | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    message: string;
    status: "new" | "read" | "resolved";
    name: string;
    email: string;
    subject: string;
    adminNote: string;
    userId?: import("mongoose").Types.ObjectId | null;
    phone?: string | null;
    readAt?: NativeDate | null;
    ipAddress?: string | null;
    userAgent?: string | null;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    message: string;
    status: "new" | "read" | "resolved";
    name: string;
    email: string;
    subject: string;
    adminNote: string;
    userId?: import("mongoose").Types.ObjectId | null;
    phone?: string | null;
    readAt?: NativeDate | null;
    ipAddress?: string | null;
    userAgent?: string | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    message: string;
    status: "new" | "read" | "resolved";
    name: string;
    email: string;
    subject: string;
    adminNote: string;
    userId?: import("mongoose").Types.ObjectId | null;
    phone?: string | null;
    readAt?: NativeDate | null;
    ipAddress?: string | null;
    userAgent?: string | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    message: string;
    status: "new" | "read" | "resolved";
    name: string;
    email: string;
    subject: string;
    adminNote: string;
    userId?: import("mongoose").Types.ObjectId | null;
    phone?: string | null;
    readAt?: NativeDate | null;
    ipAddress?: string | null;
    userAgent?: string | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    message: string;
    status: "new" | "read" | "resolved";
    name: string;
    email: string;
    subject: string;
    adminNote: string;
    userId?: import("mongoose").Types.ObjectId | null;
    phone?: string | null;
    readAt?: NativeDate | null;
    ipAddress?: string | null;
    userAgent?: string | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export {};
//# sourceMappingURL=contact.model.d.ts.map