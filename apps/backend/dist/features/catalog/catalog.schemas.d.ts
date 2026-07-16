import { z } from "zod";
export declare const MAX_PRODUCT_IMAGES = 8;
export declare const categorySchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        alt: z.ZodString;
        publicId: z.ZodOptional<z.ZodString>;
        color: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        alt: string;
        color?: string | undefined;
        publicId?: string | undefined;
    }, {
        url: string;
        alt: string;
        color?: string | undefined;
        publicId?: string | undefined;
    }>>;
    seo: z.ZodOptional<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        description?: string | undefined;
        title?: string | undefined;
    }, {
        description?: string | undefined;
        title?: string | undefined;
    }>>;
    isFeatured: z.ZodOptional<z.ZodBoolean>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    slug: string;
    description?: string | undefined;
    image?: {
        url: string;
        alt: string;
        color?: string | undefined;
        publicId?: string | undefined;
    } | undefined;
    seo?: {
        description?: string | undefined;
        title?: string | undefined;
    } | undefined;
    isFeatured?: boolean | undefined;
    isActive?: boolean | undefined;
}, {
    name: string;
    slug: string;
    description?: string | undefined;
    image?: {
        url: string;
        alt: string;
        color?: string | undefined;
        publicId?: string | undefined;
    } | undefined;
    seo?: {
        description?: string | undefined;
        title?: string | undefined;
    } | undefined;
    isFeatured?: boolean | undefined;
    isActive?: boolean | undefined;
}>;
export declare const brandSchema: z.ZodObject<Omit<{
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        alt: z.ZodString;
        publicId: z.ZodOptional<z.ZodString>;
        color: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        alt: string;
        color?: string | undefined;
        publicId?: string | undefined;
    }, {
        url: string;
        alt: string;
        color?: string | undefined;
        publicId?: string | undefined;
    }>>;
    seo: z.ZodOptional<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        description?: string | undefined;
        title?: string | undefined;
    }, {
        description?: string | undefined;
        title?: string | undefined;
    }>>;
    isFeatured: z.ZodOptional<z.ZodBoolean>;
    isActive: z.ZodOptional<z.ZodBoolean>;
} & {
    logo: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        alt: z.ZodString;
        publicId: z.ZodOptional<z.ZodString>;
        color: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        alt: string;
        color?: string | undefined;
        publicId?: string | undefined;
    }, {
        url: string;
        alt: string;
        color?: string | undefined;
        publicId?: string | undefined;
    }>>;
}, "image">, "strip", z.ZodTypeAny, {
    name: string;
    slug: string;
    description?: string | undefined;
    seo?: {
        description?: string | undefined;
        title?: string | undefined;
    } | undefined;
    isFeatured?: boolean | undefined;
    isActive?: boolean | undefined;
    logo?: {
        url: string;
        alt: string;
        color?: string | undefined;
        publicId?: string | undefined;
    } | undefined;
}, {
    name: string;
    slug: string;
    description?: string | undefined;
    seo?: {
        description?: string | undefined;
        title?: string | undefined;
    } | undefined;
    isFeatured?: boolean | undefined;
    isActive?: boolean | undefined;
    logo?: {
        url: string;
        alt: string;
        color?: string | undefined;
        publicId?: string | undefined;
    } | undefined;
}>;
export declare const productSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    sku: z.ZodString;
    description: z.ZodString;
    shortDescription: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodString;
    brandId: z.ZodString;
    price: z.ZodNumber;
    compareAtPrice: z.ZodOptional<z.ZodNumber>;
    stockQuantity: z.ZodOptional<z.ZodNumber>;
    variants: z.ZodEffects<z.ZodOptional<z.ZodArray<z.ZodObject<{
        size: z.ZodString;
        color: z.ZodString;
        stockQuantity: z.ZodNumber;
        sku: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | undefined;
    }, {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | undefined;
    }>, "many">>, {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | undefined;
    }[] | undefined, {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | undefined;
    }[] | undefined>;
    images: z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        alt: z.ZodString;
        publicId: z.ZodOptional<z.ZodString>;
        color: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        alt: string;
        color?: string | undefined;
        publicId?: string | undefined;
    }, {
        url: string;
        alt: string;
        color?: string | undefined;
        publicId?: string | undefined;
    }>, "many">>;
    seo: z.ZodOptional<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        description?: string | undefined;
        title?: string | undefined;
    }, {
        description?: string | undefined;
        title?: string | undefined;
    }>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    isFeatured: z.ZodOptional<z.ZodBoolean>;
    isPublished: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    slug: string;
    sku: string;
    categoryId: string;
    brandId: string;
    price: number;
    seo?: {
        description?: string | undefined;
        title?: string | undefined;
    } | undefined;
    isFeatured?: boolean | undefined;
    stockQuantity?: number | undefined;
    shortDescription?: string | undefined;
    compareAtPrice?: number | undefined;
    variants?: {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | undefined;
    }[] | undefined;
    images?: {
        url: string;
        alt: string;
        color?: string | undefined;
        publicId?: string | undefined;
    }[] | undefined;
    tags?: string[] | undefined;
    isPublished?: boolean | undefined;
}, {
    name: string;
    description: string;
    slug: string;
    sku: string;
    categoryId: string;
    brandId: string;
    price: number;
    seo?: {
        description?: string | undefined;
        title?: string | undefined;
    } | undefined;
    isFeatured?: boolean | undefined;
    stockQuantity?: number | undefined;
    shortDescription?: string | undefined;
    compareAtPrice?: number | undefined;
    variants?: {
        size: string;
        color: string;
        stockQuantity: number;
        sku?: string | undefined;
    }[] | undefined;
    images?: {
        url: string;
        alt: string;
        color?: string | undefined;
        publicId?: string | undefined;
    }[] | undefined;
    tags?: string[] | undefined;
    isPublished?: boolean | undefined;
}>;
export declare const listQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    search: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    brand: z.ZodOptional<z.ZodString>;
    sort: z.ZodDefault<z.ZodEnum<["newest", "price-asc", "price-desc"]>>;
}, "strip", z.ZodTypeAny, {
    sort: "newest" | "price-asc" | "price-desc";
    limit: number;
    page: number;
    search?: string | undefined;
    category?: string | undefined;
    brand?: string | undefined;
}, {
    sort?: "newest" | "price-asc" | "price-desc" | undefined;
    limit?: number | undefined;
    search?: string | undefined;
    page?: number | undefined;
    category?: string | undefined;
    brand?: string | undefined;
}>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type BrandInput = z.infer<typeof brandSchema>;
export type ProductInput = z.infer<typeof productSchema>;
//# sourceMappingURL=catalog.schemas.d.ts.map