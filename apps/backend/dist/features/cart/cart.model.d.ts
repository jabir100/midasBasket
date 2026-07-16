import { Schema, type InferSchemaType } from "mongoose";
declare const cartItemSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: false;
}, {
    productId: import("mongoose").Types.ObjectId;
    title: string;
    slug: string;
    quantity: number;
    unitPrice: number;
    imageUrl?: string | null;
    size?: string | null;
    color?: string | null;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    productId: import("mongoose").Types.ObjectId;
    title: string;
    slug: string;
    quantity: number;
    unitPrice: number;
    imageUrl?: string | null;
    size?: string | null;
    color?: string | null;
}>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    _id: false;
}>> & import("mongoose").FlatRecord<{
    productId: import("mongoose").Types.ObjectId;
    title: string;
    slug: string;
    quantity: number;
    unitPrice: number;
    imageUrl?: string | null;
    size?: string | null;
    color?: string | null;
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
declare const cartSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }>;
    currency: string;
    userId?: import("mongoose").Types.ObjectId | null;
    guestCartId?: string | null;
    couponCode?: string | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }>;
    currency: string;
    userId?: import("mongoose").Types.ObjectId | null;
    guestCartId?: string | null;
    couponCode?: string | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }>;
    currency: string;
    userId?: import("mongoose").Types.ObjectId | null;
    guestCartId?: string | null;
    couponCode?: string | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export type CartDocument = InferSchemaType<typeof cartSchema>;
export type CartItemDocument = InferSchemaType<typeof cartItemSchema>;
export declare const CartModel: import("mongoose").Model<{
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }>;
    currency: string;
    userId?: import("mongoose").Types.ObjectId | null;
    guestCartId?: string | null;
    couponCode?: string | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }>;
    currency: string;
    userId?: import("mongoose").Types.ObjectId | null;
    guestCartId?: string | null;
    couponCode?: string | null;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }>;
    currency: string;
    userId?: import("mongoose").Types.ObjectId | null;
    guestCartId?: string | null;
    couponCode?: string | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }>;
    currency: string;
    userId?: import("mongoose").Types.ObjectId | null;
    guestCartId?: string | null;
    couponCode?: string | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }>;
    currency: string;
    userId?: import("mongoose").Types.ObjectId | null;
    guestCartId?: string | null;
    couponCode?: string | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }>;
    currency: string;
    userId?: import("mongoose").Types.ObjectId | null;
    guestCartId?: string | null;
    couponCode?: string | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export {};
//# sourceMappingURL=cart.model.d.ts.map