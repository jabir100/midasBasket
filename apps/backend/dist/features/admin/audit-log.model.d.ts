import { Schema, type InferSchemaType } from "mongoose";
declare const auditLogSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: {
        createdAt: true;
        updatedAt: false;
    };
}, {
    actorUserId: import("mongoose").Types.ObjectId;
    actorEmail: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: any;
    createdAt: NativeDate;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    actorUserId: import("mongoose").Types.ObjectId;
    actorEmail: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: any;
    createdAt: NativeDate;
}>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: {
        createdAt: true;
        updatedAt: false;
    };
}>> & import("mongoose").FlatRecord<{
    actorUserId: import("mongoose").Types.ObjectId;
    actorEmail: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: any;
    createdAt: NativeDate;
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export type AuditLogDocument = InferSchemaType<typeof auditLogSchema>;
export declare const AuditLogModel: import("mongoose").Model<{
    actorUserId: import("mongoose").Types.ObjectId;
    actorEmail: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: any;
    createdAt: NativeDate;
}, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    actorUserId: import("mongoose").Types.ObjectId;
    actorEmail: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: any;
    createdAt: NativeDate;
}, {}, {
    timestamps: {
        createdAt: true;
        updatedAt: false;
    };
}> & {
    actorUserId: import("mongoose").Types.ObjectId;
    actorEmail: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: any;
    createdAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: {
        createdAt: true;
        updatedAt: false;
    };
}, {
    actorUserId: import("mongoose").Types.ObjectId;
    actorEmail: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: any;
    createdAt: NativeDate;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    actorUserId: import("mongoose").Types.ObjectId;
    actorEmail: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: any;
    createdAt: NativeDate;
}>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: {
        createdAt: true;
        updatedAt: false;
    };
}>> & import("mongoose").FlatRecord<{
    actorUserId: import("mongoose").Types.ObjectId;
    actorEmail: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: any;
    createdAt: NativeDate;
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export {};
//# sourceMappingURL=audit-log.model.d.ts.map