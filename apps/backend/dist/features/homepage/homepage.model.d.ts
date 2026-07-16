import { Schema, type InferSchemaType } from "mongoose";
declare const homepageSettingsSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    hero: {
        description: string;
        title: string;
        eyebrow: string;
        image?: {
            url: string;
            alt: string;
            publicId?: string | null;
        } | null;
        primaryAction?: {
            label: string;
            href: string;
        } | null;
        secondaryAction?: {
            label: string;
            href: string;
        } | null;
    };
    metrics: import("mongoose").Types.DocumentArray<{
        value: string;
        label: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        value: string;
        label: string;
    }> & {
        value: string;
        label: string;
    }>;
    promoBanner: {
        description: string;
        title: string;
        action?: {
            label: string;
            href: string;
        } | null;
    };
    whyChooseUs: import("mongoose").Types.DocumentArray<{
        description: string;
        title: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        description: string;
        title: string;
    }> & {
        description: string;
        title: string;
    }>;
    popularProductIds: import("mongoose").Types.ObjectId[];
    bestSellingProductIds: import("mongoose").Types.ObjectId[];
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    hero: {
        description: string;
        title: string;
        eyebrow: string;
        image?: {
            url: string;
            alt: string;
            publicId?: string | null;
        } | null;
        primaryAction?: {
            label: string;
            href: string;
        } | null;
        secondaryAction?: {
            label: string;
            href: string;
        } | null;
    };
    metrics: import("mongoose").Types.DocumentArray<{
        value: string;
        label: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        value: string;
        label: string;
    }> & {
        value: string;
        label: string;
    }>;
    promoBanner: {
        description: string;
        title: string;
        action?: {
            label: string;
            href: string;
        } | null;
    };
    whyChooseUs: import("mongoose").Types.DocumentArray<{
        description: string;
        title: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        description: string;
        title: string;
    }> & {
        description: string;
        title: string;
    }>;
    popularProductIds: import("mongoose").Types.ObjectId[];
    bestSellingProductIds: import("mongoose").Types.ObjectId[];
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    hero: {
        description: string;
        title: string;
        eyebrow: string;
        image?: {
            url: string;
            alt: string;
            publicId?: string | null;
        } | null;
        primaryAction?: {
            label: string;
            href: string;
        } | null;
        secondaryAction?: {
            label: string;
            href: string;
        } | null;
    };
    metrics: import("mongoose").Types.DocumentArray<{
        value: string;
        label: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        value: string;
        label: string;
    }> & {
        value: string;
        label: string;
    }>;
    promoBanner: {
        description: string;
        title: string;
        action?: {
            label: string;
            href: string;
        } | null;
    };
    whyChooseUs: import("mongoose").Types.DocumentArray<{
        description: string;
        title: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        description: string;
        title: string;
    }> & {
        description: string;
        title: string;
    }>;
    popularProductIds: import("mongoose").Types.ObjectId[];
    bestSellingProductIds: import("mongoose").Types.ObjectId[];
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
declare const testimonialSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    customerName: string;
    isActive: boolean;
    quote: string;
    rating: number;
    sortOrder: number;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    customerName: string;
    isActive: boolean;
    quote: string;
    rating: number;
    sortOrder: number;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    customerName: string;
    isActive: boolean;
    quote: string;
    rating: number;
    sortOrder: number;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
declare const blogSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    title: string;
    slug: string;
    isPublished: boolean;
    excerpt: string;
    content: string;
    image?: {
        url: string;
        alt: string;
        publicId?: string | null;
    } | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    publishedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    title: string;
    slug: string;
    isPublished: boolean;
    excerpt: string;
    content: string;
    image?: {
        url: string;
        alt: string;
        publicId?: string | null;
    } | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    publishedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    title: string;
    slug: string;
    isPublished: boolean;
    excerpt: string;
    content: string;
    image?: {
        url: string;
        alt: string;
        publicId?: string | null;
    } | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    publishedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
declare const carouselSlideSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    isActive: boolean;
    sortOrder: number;
    linkHref: string;
    description?: string | null;
    title?: string | null;
    image?: {
        url: string;
        alt: string;
        publicId?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    isActive: boolean;
    sortOrder: number;
    linkHref: string;
    description?: string | null;
    title?: string | null;
    image?: {
        url: string;
        alt: string;
        publicId?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    isActive: boolean;
    sortOrder: number;
    linkHref: string;
    description?: string | null;
    title?: string | null;
    image?: {
        url: string;
        alt: string;
        publicId?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export type HomepageSettingsDocument = InferSchemaType<typeof homepageSettingsSchema>;
export type TestimonialDocument = InferSchemaType<typeof testimonialSchema>;
export type BlogDocument = InferSchemaType<typeof blogSchema>;
export type CarouselSlideDocument = InferSchemaType<typeof carouselSlideSchema>;
export declare const HomepageSettingsModel: import("mongoose").Model<{
    hero: {
        description: string;
        title: string;
        eyebrow: string;
        image?: {
            url: string;
            alt: string;
            publicId?: string | null;
        } | null;
        primaryAction?: {
            label: string;
            href: string;
        } | null;
        secondaryAction?: {
            label: string;
            href: string;
        } | null;
    };
    metrics: import("mongoose").Types.DocumentArray<{
        value: string;
        label: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        value: string;
        label: string;
    }> & {
        value: string;
        label: string;
    }>;
    promoBanner: {
        description: string;
        title: string;
        action?: {
            label: string;
            href: string;
        } | null;
    };
    whyChooseUs: import("mongoose").Types.DocumentArray<{
        description: string;
        title: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        description: string;
        title: string;
    }> & {
        description: string;
        title: string;
    }>;
    popularProductIds: import("mongoose").Types.ObjectId[];
    bestSellingProductIds: import("mongoose").Types.ObjectId[];
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    hero: {
        description: string;
        title: string;
        eyebrow: string;
        image?: {
            url: string;
            alt: string;
            publicId?: string | null;
        } | null;
        primaryAction?: {
            label: string;
            href: string;
        } | null;
        secondaryAction?: {
            label: string;
            href: string;
        } | null;
    };
    metrics: import("mongoose").Types.DocumentArray<{
        value: string;
        label: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        value: string;
        label: string;
    }> & {
        value: string;
        label: string;
    }>;
    promoBanner: {
        description: string;
        title: string;
        action?: {
            label: string;
            href: string;
        } | null;
    };
    whyChooseUs: import("mongoose").Types.DocumentArray<{
        description: string;
        title: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        description: string;
        title: string;
    }> & {
        description: string;
        title: string;
    }>;
    popularProductIds: import("mongoose").Types.ObjectId[];
    bestSellingProductIds: import("mongoose").Types.ObjectId[];
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    hero: {
        description: string;
        title: string;
        eyebrow: string;
        image?: {
            url: string;
            alt: string;
            publicId?: string | null;
        } | null;
        primaryAction?: {
            label: string;
            href: string;
        } | null;
        secondaryAction?: {
            label: string;
            href: string;
        } | null;
    };
    metrics: import("mongoose").Types.DocumentArray<{
        value: string;
        label: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        value: string;
        label: string;
    }> & {
        value: string;
        label: string;
    }>;
    promoBanner: {
        description: string;
        title: string;
        action?: {
            label: string;
            href: string;
        } | null;
    };
    whyChooseUs: import("mongoose").Types.DocumentArray<{
        description: string;
        title: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        description: string;
        title: string;
    }> & {
        description: string;
        title: string;
    }>;
    popularProductIds: import("mongoose").Types.ObjectId[];
    bestSellingProductIds: import("mongoose").Types.ObjectId[];
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    hero: {
        description: string;
        title: string;
        eyebrow: string;
        image?: {
            url: string;
            alt: string;
            publicId?: string | null;
        } | null;
        primaryAction?: {
            label: string;
            href: string;
        } | null;
        secondaryAction?: {
            label: string;
            href: string;
        } | null;
    };
    metrics: import("mongoose").Types.DocumentArray<{
        value: string;
        label: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        value: string;
        label: string;
    }> & {
        value: string;
        label: string;
    }>;
    promoBanner: {
        description: string;
        title: string;
        action?: {
            label: string;
            href: string;
        } | null;
    };
    whyChooseUs: import("mongoose").Types.DocumentArray<{
        description: string;
        title: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        description: string;
        title: string;
    }> & {
        description: string;
        title: string;
    }>;
    popularProductIds: import("mongoose").Types.ObjectId[];
    bestSellingProductIds: import("mongoose").Types.ObjectId[];
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    hero: {
        description: string;
        title: string;
        eyebrow: string;
        image?: {
            url: string;
            alt: string;
            publicId?: string | null;
        } | null;
        primaryAction?: {
            label: string;
            href: string;
        } | null;
        secondaryAction?: {
            label: string;
            href: string;
        } | null;
    };
    metrics: import("mongoose").Types.DocumentArray<{
        value: string;
        label: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        value: string;
        label: string;
    }> & {
        value: string;
        label: string;
    }>;
    promoBanner: {
        description: string;
        title: string;
        action?: {
            label: string;
            href: string;
        } | null;
    };
    whyChooseUs: import("mongoose").Types.DocumentArray<{
        description: string;
        title: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        description: string;
        title: string;
    }> & {
        description: string;
        title: string;
    }>;
    popularProductIds: import("mongoose").Types.ObjectId[];
    bestSellingProductIds: import("mongoose").Types.ObjectId[];
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    hero: {
        description: string;
        title: string;
        eyebrow: string;
        image?: {
            url: string;
            alt: string;
            publicId?: string | null;
        } | null;
        primaryAction?: {
            label: string;
            href: string;
        } | null;
        secondaryAction?: {
            label: string;
            href: string;
        } | null;
    };
    metrics: import("mongoose").Types.DocumentArray<{
        value: string;
        label: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        value: string;
        label: string;
    }> & {
        value: string;
        label: string;
    }>;
    promoBanner: {
        description: string;
        title: string;
        action?: {
            label: string;
            href: string;
        } | null;
    };
    whyChooseUs: import("mongoose").Types.DocumentArray<{
        description: string;
        title: string;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        description: string;
        title: string;
    }> & {
        description: string;
        title: string;
    }>;
    popularProductIds: import("mongoose").Types.ObjectId[];
    bestSellingProductIds: import("mongoose").Types.ObjectId[];
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export declare const TestimonialModel: import("mongoose").Model<{
    customerName: string;
    isActive: boolean;
    quote: string;
    rating: number;
    sortOrder: number;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    customerName: string;
    isActive: boolean;
    quote: string;
    rating: number;
    sortOrder: number;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    customerName: string;
    isActive: boolean;
    quote: string;
    rating: number;
    sortOrder: number;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    customerName: string;
    isActive: boolean;
    quote: string;
    rating: number;
    sortOrder: number;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    customerName: string;
    isActive: boolean;
    quote: string;
    rating: number;
    sortOrder: number;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    customerName: string;
    isActive: boolean;
    quote: string;
    rating: number;
    sortOrder: number;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export declare const BlogModel: import("mongoose").Model<{
    title: string;
    slug: string;
    isPublished: boolean;
    excerpt: string;
    content: string;
    image?: {
        url: string;
        alt: string;
        publicId?: string | null;
    } | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    publishedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    title: string;
    slug: string;
    isPublished: boolean;
    excerpt: string;
    content: string;
    image?: {
        url: string;
        alt: string;
        publicId?: string | null;
    } | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    publishedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    title: string;
    slug: string;
    isPublished: boolean;
    excerpt: string;
    content: string;
    image?: {
        url: string;
        alt: string;
        publicId?: string | null;
    } | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    publishedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    title: string;
    slug: string;
    isPublished: boolean;
    excerpt: string;
    content: string;
    image?: {
        url: string;
        alt: string;
        publicId?: string | null;
    } | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    publishedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    title: string;
    slug: string;
    isPublished: boolean;
    excerpt: string;
    content: string;
    image?: {
        url: string;
        alt: string;
        publicId?: string | null;
    } | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    publishedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    title: string;
    slug: string;
    isPublished: boolean;
    excerpt: string;
    content: string;
    image?: {
        url: string;
        alt: string;
        publicId?: string | null;
    } | null;
    seo?: {
        description?: string | null;
        title?: string | null;
    } | null;
    publishedAt?: NativeDate | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export declare const CarouselSlideModel: import("mongoose").Model<{
    isActive: boolean;
    sortOrder: number;
    linkHref: string;
    description?: string | null;
    title?: string | null;
    image?: {
        url: string;
        alt: string;
        publicId?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    isActive: boolean;
    sortOrder: number;
    linkHref: string;
    description?: string | null;
    title?: string | null;
    image?: {
        url: string;
        alt: string;
        publicId?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    isActive: boolean;
    sortOrder: number;
    linkHref: string;
    description?: string | null;
    title?: string | null;
    image?: {
        url: string;
        alt: string;
        publicId?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    isActive: boolean;
    sortOrder: number;
    linkHref: string;
    description?: string | null;
    title?: string | null;
    image?: {
        url: string;
        alt: string;
        publicId?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    isActive: boolean;
    sortOrder: number;
    linkHref: string;
    description?: string | null;
    title?: string | null;
    image?: {
        url: string;
        alt: string;
        publicId?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps>, {}, import("mongoose").MergeType<import("mongoose").DefaultSchemaOptions, {
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    isActive: boolean;
    sortOrder: number;
    linkHref: string;
    description?: string | null;
    title?: string | null;
    image?: {
        url: string;
        alt: string;
        publicId?: string | null;
    } | null;
} & import("mongoose").DefaultTimestampProps> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export {};
//# sourceMappingURL=homepage.model.d.ts.map