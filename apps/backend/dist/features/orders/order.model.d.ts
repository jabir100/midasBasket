import { Schema, type InferSchemaType } from "mongoose";
export declare const orderStatuses: readonly ["placed", "confirmed", "packed", "shipped", "out-for-delivery", "delivered", "cancelled"];
declare const orderSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: {
        line1: string;
        area: string;
        city: string;
        country: string;
        line2?: string | null;
        postalCode?: string | null;
    };
    paymentMethod: "cod";
    paymentStatus: "pending" | "paid" | "failed";
    statusTimeline: import("mongoose").Types.DocumentArray<{
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }> & {
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }>;
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }>;
    currency: string;
    subTotal: number;
    shippingFee: number;
    discountTotal: number;
    total: number;
    userId?: import("mongoose").Types.ObjectId | null;
    guestCartId?: string | null;
    notes?: string | null;
    couponCode?: string | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: {
        line1: string;
        area: string;
        city: string;
        country: string;
        line2?: string | null;
        postalCode?: string | null;
    };
    paymentMethod: "cod";
    paymentStatus: "pending" | "paid" | "failed";
    statusTimeline: import("mongoose").Types.DocumentArray<{
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }> & {
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }>;
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }>;
    currency: string;
    subTotal: number;
    shippingFee: number;
    discountTotal: number;
    total: number;
    userId?: import("mongoose").Types.ObjectId | null;
    guestCartId?: string | null;
    notes?: string | null;
    couponCode?: string | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: {
        line1: string;
        area: string;
        city: string;
        country: string;
        line2?: string | null;
        postalCode?: string | null;
    };
    paymentMethod: "cod";
    paymentStatus: "pending" | "paid" | "failed";
    statusTimeline: import("mongoose").Types.DocumentArray<{
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }> & {
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }>;
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }>;
    currency: string;
    subTotal: number;
    shippingFee: number;
    discountTotal: number;
    total: number;
    userId?: import("mongoose").Types.ObjectId | null;
    guestCartId?: string | null;
    notes?: string | null;
    couponCode?: string | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export type OrderStatus = (typeof orderStatuses)[number];
export type OrderDocument = InferSchemaType<typeof orderSchema>;
export declare const OrderModel: import("mongoose").Model<{
    status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: {
        line1: string;
        area: string;
        city: string;
        country: string;
        line2?: string | null;
        postalCode?: string | null;
    };
    paymentMethod: "cod";
    paymentStatus: "pending" | "paid" | "failed";
    statusTimeline: import("mongoose").Types.DocumentArray<{
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }> & {
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }>;
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }>;
    currency: string;
    subTotal: number;
    shippingFee: number;
    discountTotal: number;
    total: number;
    userId?: import("mongoose").Types.ObjectId | null;
    guestCartId?: string | null;
    notes?: string | null;
    couponCode?: string | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: {
        line1: string;
        area: string;
        city: string;
        country: string;
        line2?: string | null;
        postalCode?: string | null;
    };
    paymentMethod: "cod";
    paymentStatus: "pending" | "paid" | "failed";
    statusTimeline: import("mongoose").Types.DocumentArray<{
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }> & {
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }>;
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }>;
    currency: string;
    subTotal: number;
    shippingFee: number;
    discountTotal: number;
    total: number;
    userId?: import("mongoose").Types.ObjectId | null;
    guestCartId?: string | null;
    notes?: string | null;
    couponCode?: string | null;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: {
        line1: string;
        area: string;
        city: string;
        country: string;
        line2?: string | null;
        postalCode?: string | null;
    };
    paymentMethod: "cod";
    paymentStatus: "pending" | "paid" | "failed";
    statusTimeline: import("mongoose").Types.DocumentArray<{
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }> & {
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }>;
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }>;
    currency: string;
    subTotal: number;
    shippingFee: number;
    discountTotal: number;
    total: number;
    userId?: import("mongoose").Types.ObjectId | null;
    guestCartId?: string | null;
    notes?: string | null;
    couponCode?: string | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: {
        line1: string;
        area: string;
        city: string;
        country: string;
        line2?: string | null;
        postalCode?: string | null;
    };
    paymentMethod: "cod";
    paymentStatus: "pending" | "paid" | "failed";
    statusTimeline: import("mongoose").Types.DocumentArray<{
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }> & {
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }>;
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }>;
    currency: string;
    subTotal: number;
    shippingFee: number;
    discountTotal: number;
    total: number;
    userId?: import("mongoose").Types.ObjectId | null;
    guestCartId?: string | null;
    notes?: string | null;
    couponCode?: string | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: {
        line1: string;
        area: string;
        city: string;
        country: string;
        line2?: string | null;
        postalCode?: string | null;
    };
    paymentMethod: "cod";
    paymentStatus: "pending" | "paid" | "failed";
    statusTimeline: import("mongoose").Types.DocumentArray<{
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }> & {
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }>;
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }>;
    currency: string;
    subTotal: number;
    shippingFee: number;
    discountTotal: number;
    total: number;
    userId?: import("mongoose").Types.ObjectId | null;
    guestCartId?: string | null;
    notes?: string | null;
    couponCode?: string | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: {
        line1: string;
        area: string;
        city: string;
        country: string;
        line2?: string | null;
        postalCode?: string | null;
    };
    paymentMethod: "cod";
    paymentStatus: "pending" | "paid" | "failed";
    statusTimeline: import("mongoose").Types.DocumentArray<{
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }> & {
        status: "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered" | "cancelled";
        timestamp: NativeDate;
        updatedBy: string;
        note?: string | null;
    }>;
    items: import("mongoose").Types.DocumentArray<{
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }> & {
        productId: import("mongoose").Types.ObjectId;
        title: string;
        slug: string;
        quantity: number;
        unitPrice: number;
        lineTotal: number;
        imageUrl?: string | null;
        size?: string | null;
        color?: string | null;
    }>;
    currency: string;
    subTotal: number;
    shippingFee: number;
    discountTotal: number;
    total: number;
    userId?: import("mongoose").Types.ObjectId | null;
    guestCartId?: string | null;
    notes?: string | null;
    couponCode?: string | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export {};
//# sourceMappingURL=order.model.d.ts.map