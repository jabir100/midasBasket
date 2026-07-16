import { Schema, type InferSchemaType } from "mongoose";
declare const passwordResetTokenSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    userId: import("mongoose").Types.ObjectId;
    tokenHash: string;
    expiresAt: NativeDate;
    consumedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    userId: import("mongoose").Types.ObjectId;
    tokenHash: string;
    expiresAt: NativeDate;
    consumedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    userId: import("mongoose").Types.ObjectId;
    tokenHash: string;
    expiresAt: NativeDate;
    consumedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export type PasswordResetTokenDocument = InferSchemaType<typeof passwordResetTokenSchema>;
export declare const PasswordResetTokenModel: import("mongoose").Model<{
    userId: import("mongoose").Types.ObjectId;
    tokenHash: string;
    expiresAt: NativeDate;
    consumedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    userId: import("mongoose").Types.ObjectId;
    tokenHash: string;
    expiresAt: NativeDate;
    consumedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    userId: import("mongoose").Types.ObjectId;
    tokenHash: string;
    expiresAt: NativeDate;
    consumedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    userId: import("mongoose").Types.ObjectId;
    tokenHash: string;
    expiresAt: NativeDate;
    consumedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    userId: import("mongoose").Types.ObjectId;
    tokenHash: string;
    expiresAt: NativeDate;
    consumedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    userId: import("mongoose").Types.ObjectId;
    tokenHash: string;
    expiresAt: NativeDate;
    consumedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export {};
//# sourceMappingURL=password-reset-token.model.d.ts.map