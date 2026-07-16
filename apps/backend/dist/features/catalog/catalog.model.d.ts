import { Schema, type InferSchemaType } from "mongoose";
declare const categorySchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    slug: string;
    isFeatured: boolean;
    isActive: boolean;
    description?: string | null;
    image?: {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    } | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    name: string;
    slug: string;
    isFeatured: boolean;
    isActive: boolean;
    description?: string | null;
    image?: {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    } | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    name: string;
    slug: string;
    isFeatured: boolean;
    isActive: boolean;
    description?: string | null;
    image?: {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    } | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
declare const brandSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    slug: string;
    isFeatured: boolean;
    isActive: boolean;
    description?: string | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    logo?: {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    name: string;
    slug: string;
    isFeatured: boolean;
    isActive: boolean;
    description?: string | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    logo?: {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    name: string;
    slug: string;
    isFeatured: boolean;
    isActive: boolean;
    description?: string | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    logo?: {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
declare const productSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    description: string;
    slug: string;
    isFeatured: boolean;
    stockQuantity: number;
    sku: string;
    categoryId: import("mongoose").Types.ObjectId;
    brandId: import("mongoose").Types.ObjectId;
    price: number;
    variants: import("mongoose").Types.DocumentArray<{
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }> & {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }>;
    images: import("mongoose").Types.DocumentArray<{
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }> & {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }>;
    tags: string[];
    isPublished: boolean;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    shortDescription?: string | null;
    compareAtPrice?: number | null;
    publishedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    name: string;
    description: string;
    slug: string;
    isFeatured: boolean;
    stockQuantity: number;
    sku: string;
    categoryId: import("mongoose").Types.ObjectId;
    brandId: import("mongoose").Types.ObjectId;
    price: number;
    variants: import("mongoose").Types.DocumentArray<{
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }> & {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }>;
    images: import("mongoose").Types.DocumentArray<{
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }> & {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }>;
    tags: string[];
    isPublished: boolean;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    shortDescription?: string | null;
    compareAtPrice?: number | null;
    publishedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    name: string;
    description: string;
    slug: string;
    isFeatured: boolean;
    stockQuantity: number;
    sku: string;
    categoryId: import("mongoose").Types.ObjectId;
    brandId: import("mongoose").Types.ObjectId;
    price: number;
    variants: import("mongoose").Types.DocumentArray<{
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }> & {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }>;
    images: import("mongoose").Types.DocumentArray<{
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }> & {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }>;
    tags: string[];
    isPublished: boolean;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    shortDescription?: string | null;
    compareAtPrice?: number | null;
    publishedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export type CategoryDocument = InferSchemaType<typeof categorySchema>;
export type BrandDocument = InferSchemaType<typeof brandSchema>;
export type ProductDocument = InferSchemaType<typeof productSchema>;
export declare const CategoryModel: import("mongoose").Model<{
    name: string;
    slug: string;
    isFeatured: boolean;
    isActive: boolean;
    description?: string | null;
    image?: {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    } | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    name: string;
    slug: string;
    isFeatured: boolean;
    isActive: boolean;
    description?: string | null;
    image?: {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    } | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    slug: string;
    isFeatured: boolean;
    isActive: boolean;
    description?: string | null;
    image?: {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    } | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    slug: string;
    isFeatured: boolean;
    isActive: boolean;
    description?: string | null;
    image?: {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    } | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    name: string;
    slug: string;
    isFeatured: boolean;
    isActive: boolean;
    description?: string | null;
    image?: {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    } | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    name: string;
    slug: string;
    isFeatured: boolean;
    isActive: boolean;
    description?: string | null;
    image?: {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    } | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export declare const BrandModel: import("mongoose").Model<{
    name: string;
    slug: string;
    isFeatured: boolean;
    isActive: boolean;
    description?: string | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    logo?: {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    name: string;
    slug: string;
    isFeatured: boolean;
    isActive: boolean;
    description?: string | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    logo?: {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    slug: string;
    isFeatured: boolean;
    isActive: boolean;
    description?: string | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    logo?: {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    slug: string;
    isFeatured: boolean;
    isActive: boolean;
    description?: string | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    logo?: {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    name: string;
    slug: string;
    isFeatured: boolean;
    isActive: boolean;
    description?: string | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    logo?: {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    name: string;
    slug: string;
    isFeatured: boolean;
    isActive: boolean;
    description?: string | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    logo?: {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export declare const ProductModel: import("mongoose").Model<{
    name: string;
    description: string;
    slug: string;
    isFeatured: boolean;
    stockQuantity: number;
    sku: string;
    categoryId: import("mongoose").Types.ObjectId;
    brandId: import("mongoose").Types.ObjectId;
    price: number;
    variants: import("mongoose").Types.DocumentArray<{
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }> & {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }>;
    images: import("mongoose").Types.DocumentArray<{
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }> & {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }>;
    tags: string[];
    isPublished: boolean;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    shortDescription?: string | null;
    compareAtPrice?: number | null;
    publishedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    name: string;
    description: string;
    slug: string;
    isFeatured: boolean;
    stockQuantity: number;
    sku: string;
    categoryId: import("mongoose").Types.ObjectId;
    brandId: import("mongoose").Types.ObjectId;
    price: number;
    variants: import("mongoose").Types.DocumentArray<{
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }> & {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }>;
    images: import("mongoose").Types.DocumentArray<{
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }> & {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }>;
    tags: string[];
    isPublished: boolean;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    shortDescription?: string | null;
    compareAtPrice?: number | null;
    publishedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    name: string;
    description: string;
    slug: string;
    isFeatured: boolean;
    stockQuantity: number;
    sku: string;
    categoryId: import("mongoose").Types.ObjectId;
    brandId: import("mongoose").Types.ObjectId;
    price: number;
    variants: import("mongoose").Types.DocumentArray<{
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }> & {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }>;
    images: import("mongoose").Types.DocumentArray<{
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }> & {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }>;
    tags: string[];
    isPublished: boolean;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    shortDescription?: string | null;
    compareAtPrice?: number | null;
    publishedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    description: string;
    slug: string;
    isFeatured: boolean;
    stockQuantity: number;
    sku: string;
    categoryId: import("mongoose").Types.ObjectId;
    brandId: import("mongoose").Types.ObjectId;
    price: number;
    variants: import("mongoose").Types.DocumentArray<{
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }> & {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }>;
    images: import("mongoose").Types.DocumentArray<{
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }> & {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }>;
    tags: string[];
    isPublished: boolean;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    shortDescription?: string | null;
    compareAtPrice?: number | null;
    publishedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    name: string;
    description: string;
    slug: string;
    isFeatured: boolean;
    stockQuantity: number;
    sku: string;
    categoryId: import("mongoose").Types.ObjectId;
    brandId: import("mongoose").Types.ObjectId;
    price: number;
    variants: import("mongoose").Types.DocumentArray<{
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }> & {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }>;
    images: import("mongoose").Types.DocumentArray<{
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }> & {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }>;
    tags: string[];
    isPublished: boolean;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    shortDescription?: string | null;
    compareAtPrice?: number | null;
    publishedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    name: string;
    description: string;
    slug: string;
    isFeatured: boolean;
    stockQuantity: number;
    sku: string;
    categoryId: import("mongoose").Types.ObjectId;
    brandId: import("mongoose").Types.ObjectId;
    price: number;
    variants: import("mongoose").Types.DocumentArray<{
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }> & {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | null;
    }>;
    images: import("mongoose").Types.DocumentArray<{
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }> & {
        url: string;
        alt: string;
        color?: string | null;
        publicId?: string | null;
    }>;
    tags: string[];
    isPublished: boolean;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    shortDescription?: string | null;
    compareAtPrice?: number | null;
    publishedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export {};
//# sourceMappingURL=catalog.model.d.ts.map