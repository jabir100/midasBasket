import { z } from "zod";
export declare const homepageSettingsSchema: z.ZodObject<{
    hero: z.ZodOptional<z.ZodObject<{
        eyebrow: z.ZodOptional<z.ZodString>;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        primaryAction: z.ZodOptional<z.ZodObject<{
            href: z.ZodString;
            label: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            label: string;
            href: string;
        }, {
            label: string;
            href: string;
        }>>;
        secondaryAction: z.ZodOptional<z.ZodObject<{
            href: z.ZodString;
            label: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            label: string;
            href: string;
        }, {
            label: string;
            href: string;
        }>>;
        image: z.ZodOptional<z.ZodObject<{
            url: z.ZodString;
            alt: z.ZodString;
            publicId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            url: string;
            alt: string;
            publicId?: string | undefined;
        }, {
            url: string;
            alt: string;
            publicId?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description?: string | undefined;
        image?: {
            url: string;
            alt: string;
            publicId?: string | undefined;
        } | undefined;
        primaryAction?: {
            label: string;
            href: string;
        } | undefined;
        secondaryAction?: {
            label: string;
            href: string;
        } | undefined;
        eyebrow?: string | undefined;
    }, {
        title: string;
        description?: string | undefined;
        image?: {
            url: string;
            alt: string;
            publicId?: string | undefined;
        } | undefined;
        primaryAction?: {
            label: string;
            href: string;
        } | undefined;
        secondaryAction?: {
            label: string;
            href: string;
        } | undefined;
        eyebrow?: string | undefined;
    }>>;
    metrics: z.ZodOptional<z.ZodArray<z.ZodObject<{
        value: z.ZodString;
        label: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        label: string;
    }, {
        value: string;
        label: string;
    }>, "many">>;
    promoBanner: z.ZodOptional<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        action: z.ZodOptional<z.ZodObject<{
            href: z.ZodString;
            label: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            label: string;
            href: string;
        }, {
            label: string;
            href: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description?: string | undefined;
        action?: {
            label: string;
            href: string;
        } | undefined;
    }, {
        title: string;
        description?: string | undefined;
        action?: {
            label: string;
            href: string;
        } | undefined;
    }>>;
    whyChooseUs: z.ZodOptional<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description?: string | undefined;
    }, {
        title: string;
        description?: string | undefined;
    }>, "many">>;
    popularProductIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    bestSellingProductIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    hero?: {
        title: string;
        description?: string | undefined;
        image?: {
            url: string;
            alt: string;
            publicId?: string | undefined;
        } | undefined;
        primaryAction?: {
            label: string;
            href: string;
        } | undefined;
        secondaryAction?: {
            label: string;
            href: string;
        } | undefined;
        eyebrow?: string | undefined;
    } | undefined;
    metrics?: {
        value: string;
        label: string;
    }[] | undefined;
    promoBanner?: {
        title: string;
        description?: string | undefined;
        action?: {
            label: string;
            href: string;
        } | undefined;
    } | undefined;
    whyChooseUs?: {
        title: string;
        description?: string | undefined;
    }[] | undefined;
    popularProductIds?: string[] | undefined;
    bestSellingProductIds?: string[] | undefined;
}, {
    hero?: {
        title: string;
        description?: string | undefined;
        image?: {
            url: string;
            alt: string;
            publicId?: string | undefined;
        } | undefined;
        primaryAction?: {
            label: string;
            href: string;
        } | undefined;
        secondaryAction?: {
            label: string;
            href: string;
        } | undefined;
        eyebrow?: string | undefined;
    } | undefined;
    metrics?: {
        value: string;
        label: string;
    }[] | undefined;
    promoBanner?: {
        title: string;
        description?: string | undefined;
        action?: {
            label: string;
            href: string;
        } | undefined;
    } | undefined;
    whyChooseUs?: {
        title: string;
        description?: string | undefined;
    }[] | undefined;
    popularProductIds?: string[] | undefined;
    bestSellingProductIds?: string[] | undefined;
}>;
export declare const testimonialSchema: z.ZodObject<{
    customerName: z.ZodString;
    quote: z.ZodString;
    rating: z.ZodNumber;
    isActive: z.ZodOptional<z.ZodBoolean>;
    sortOrder: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    customerName: string;
    quote: string;
    rating: number;
    isActive?: boolean | undefined;
    sortOrder?: number | undefined;
}, {
    customerName: string;
    quote: string;
    rating: number;
    isActive?: boolean | undefined;
    sortOrder?: number | undefined;
}>;
export declare const blogSchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodString;
    excerpt: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodObject<{
        url: z.ZodString;
        alt: z.ZodString;
        publicId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        alt: string;
        publicId?: string | undefined;
    }, {
        url: string;
        alt: string;
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
    isPublished: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    title: string;
    slug: string;
    image?: {
        url: string;
        alt: string;
        publicId?: string | undefined;
    } | undefined;
    seo?: {
        description?: string | undefined;
        title?: string | undefined;
    } | undefined;
    isPublished?: boolean | undefined;
    excerpt?: string | undefined;
    content?: string | undefined;
}, {
    title: string;
    slug: string;
    image?: {
        url: string;
        alt: string;
        publicId?: string | undefined;
    } | undefined;
    seo?: {
        description?: string | undefined;
        title?: string | undefined;
    } | undefined;
    isPublished?: boolean | undefined;
    excerpt?: string | undefined;
    content?: string | undefined;
}>;
export declare const carouselSlideSchema: z.ZodObject<{
    linkHref: z.ZodString;
    imageAlt: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    isActive: boolean;
    sortOrder: number;
    linkHref: string;
    description?: string | undefined;
    title?: string | undefined;
    imageAlt?: string | undefined;
}, {
    linkHref: string;
    description?: string | undefined;
    title?: string | undefined;
    isActive?: boolean | undefined;
    sortOrder?: number | undefined;
    imageAlt?: string | undefined;
}>;
//# sourceMappingURL=homepage.schemas.d.ts.map