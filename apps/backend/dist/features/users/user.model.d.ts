import { Schema, type InferSchemaType } from "mongoose";
declare const userSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    status: "active" | "blocked";
    role: "admin" | "customer";
    name: string;
    email: string;
    passwordHash: string;
    addresses: import("mongoose").Types.DocumentArray<{
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }> & {
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }>;
    notificationPreferences: {
        emailOrders: boolean;
        emailOffers: boolean;
        smsOrders: boolean;
        pushNotifications: boolean;
    };
    phone?: string | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    status: "active" | "blocked";
    role: "admin" | "customer";
    name: string;
    email: string;
    passwordHash: string;
    addresses: import("mongoose").Types.DocumentArray<{
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }> & {
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }>;
    notificationPreferences: {
        emailOrders: boolean;
        emailOffers: boolean;
        smsOrders: boolean;
        pushNotifications: boolean;
    };
    phone?: string | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    status: "active" | "blocked";
    role: "admin" | "customer";
    name: string;
    email: string;
    passwordHash: string;
    addresses: import("mongoose").Types.DocumentArray<{
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }> & {
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }>;
    notificationPreferences: {
        emailOrders: boolean;
        emailOffers: boolean;
        smsOrders: boolean;
        pushNotifications: boolean;
    };
    phone?: string | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export type UserDocument = InferSchemaType<typeof userSchema> & {
    _id: unknown;
};
export declare const UserModel: import("mongoose").Model<{
    status: "active" | "blocked";
    role: "admin" | "customer";
    name: string;
    email: string;
    passwordHash: string;
    addresses: import("mongoose").Types.DocumentArray<{
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }> & {
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }>;
    notificationPreferences: {
        emailOrders: boolean;
        emailOffers: boolean;
        smsOrders: boolean;
        pushNotifications: boolean;
    };
    phone?: string | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    status: "active" | "blocked";
    role: "admin" | "customer";
    name: string;
    email: string;
    passwordHash: string;
    addresses: import("mongoose").Types.DocumentArray<{
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }> & {
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }>;
    notificationPreferences: {
        emailOrders: boolean;
        emailOffers: boolean;
        smsOrders: boolean;
        pushNotifications: boolean;
    };
    phone?: string | null;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    status: "active" | "blocked";
    role: "admin" | "customer";
    name: string;
    email: string;
    passwordHash: string;
    addresses: import("mongoose").Types.DocumentArray<{
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }> & {
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }>;
    notificationPreferences: {
        emailOrders: boolean;
        emailOffers: boolean;
        smsOrders: boolean;
        pushNotifications: boolean;
    };
    phone?: string | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    status: "active" | "blocked";
    role: "admin" | "customer";
    name: string;
    email: string;
    passwordHash: string;
    addresses: import("mongoose").Types.DocumentArray<{
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }> & {
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }>;
    notificationPreferences: {
        emailOrders: boolean;
        emailOffers: boolean;
        smsOrders: boolean;
        pushNotifications: boolean;
    };
    phone?: string | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    status: "active" | "blocked";
    role: "admin" | "customer";
    name: string;
    email: string;
    passwordHash: string;
    addresses: import("mongoose").Types.DocumentArray<{
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }> & {
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }>;
    notificationPreferences: {
        emailOrders: boolean;
        emailOffers: boolean;
        smsOrders: boolean;
        pushNotifications: boolean;
    };
    phone?: string | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    status: "active" | "blocked";
    role: "admin" | "customer";
    name: string;
    email: string;
    passwordHash: string;
    addresses: import("mongoose").Types.DocumentArray<{
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }> & {
        label: string;
        line1: string;
        area: string;
        city: string;
        country: string;
        isDefault: boolean;
        line2?: string | null;
        postalCode?: string | null;
    }>;
    notificationPreferences: {
        emailOrders: boolean;
        emailOffers: boolean;
        smsOrders: boolean;
        pushNotifications: boolean;
    };
    phone?: string | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export {};
//# sourceMappingURL=user.model.d.ts.map