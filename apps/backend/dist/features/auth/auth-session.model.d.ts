import { Schema, type InferSchemaType, type Types } from "mongoose";
declare const authSessionSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: NativeDate;
    revokedAt?: NativeDate | null;
    replacedBySessionId?: Types.ObjectId | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: NativeDate;
    revokedAt?: NativeDate | null;
    replacedBySessionId?: Types.ObjectId | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: NativeDate;
    revokedAt?: NativeDate | null;
    replacedBySessionId?: Types.ObjectId | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type AuthSessionDocument = InferSchemaType<typeof authSessionSchema> & {
    _id: Types.ObjectId;
};
export declare const AuthSessionModel: import("mongoose").Model<{
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: NativeDate;
    revokedAt?: NativeDate | null;
    replacedBySessionId?: Types.ObjectId | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: NativeDate;
    revokedAt?: NativeDate | null;
    replacedBySessionId?: Types.ObjectId | null;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: NativeDate;
    revokedAt?: NativeDate | null;
    replacedBySessionId?: Types.ObjectId | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: NativeDate;
    revokedAt?: NativeDate | null;
    replacedBySessionId?: Types.ObjectId | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: NativeDate;
    revokedAt?: NativeDate | null;
    replacedBySessionId?: Types.ObjectId | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: NativeDate;
    revokedAt?: NativeDate | null;
    replacedBySessionId?: Types.ObjectId | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>>;
export {};
//# sourceMappingURL=auth-session.model.d.ts.map