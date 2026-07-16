import { Schema, type InferSchemaType } from "mongoose";
declare const wishlistSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    userId: import("mongoose").Types.ObjectId;
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }>;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    userId: import("mongoose").Types.ObjectId;
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }>;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    userId: import("mongoose").Types.ObjectId;
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }>;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export type WishlistDocument = InferSchemaType<typeof wishlistSchema>;
export declare const WishlistModel: import("mongoose").Model<{
    userId: import("mongoose").Types.ObjectId;
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }>;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    userId: import("mongoose").Types.ObjectId;
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }>;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    userId: import("mongoose").Types.ObjectId;
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }>;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    userId: import("mongoose").Types.ObjectId;
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }>;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    userId: import("mongoose").Types.ObjectId;
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }>;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    userId: import("mongoose").Types.ObjectId;
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        addedAt: NativeDate;
    }>;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export {};
//# sourceMappingURL=wishlist.model.d.ts.map