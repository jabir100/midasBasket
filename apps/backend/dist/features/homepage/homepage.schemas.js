import { z } from "zod";
const image = z.object({
    url: z.string().trim().url(),
    alt: z.string().trim().min(2).max(140),
    publicId: z.string().trim().min(1).optional(),
});
const link = z.object({
    href: z.string().trim().min(1).max(500),
    label: z.string().trim().min(1).max(80),
});
export const homepageSettingsSchema = z.object({
    hero: z
        .object({
        eyebrow: z.string().trim().max(120).optional(),
        title: z.string().trim().min(2).max(200),
        description: z.string().trim().max(500).optional(),
        primaryAction: link.optional(),
        secondaryAction: link.optional(),
        image: image.optional(),
    })
        .optional(),
    metrics: z
        .array(z.object({
        value: z.string().trim().min(1).max(20),
        label: z.string().trim().min(1).max(60),
    }))
        .max(6)
        .optional(),
    promoBanner: z
        .object({
        title: z.string().trim().min(2).max(200),
        description: z.string().trim().max(500).optional(),
        action: link.optional(),
    })
        .optional(),
    whyChooseUs: z
        .array(z.object({
        title: z.string().trim().min(2).max(120),
        description: z.string().trim().max(400).optional(),
    }))
        .max(6)
        .optional(),
    popularProductIds: z.array(z.string().trim().min(1)).max(24).optional(),
    bestSellingProductIds: z.array(z.string().trim().min(1)).max(24).optional(),
});
export const testimonialSchema = z.object({
    customerName: z.string().trim().min(2).max(120),
    quote: z.string().trim().min(10).max(500),
    rating: z.number().int().min(1).max(5),
    isActive: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
});
const slug = z
    .string()
    .trim()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const blogSchema = z.object({
    title: z.string().trim().min(2).max(200),
    slug,
    excerpt: z.string().trim().max(500).optional(),
    content: z.string().trim().optional(),
    image: image.optional(),
    seo: z
        .object({
        title: z.string().trim().max(70).optional(),
        description: z.string().trim().max(170).optional(),
    })
        .optional(),
    isPublished: z.boolean().optional(),
});
export const carouselSlideSchema = z.object({
    linkHref: z.string().trim().min(1).max(500),
    imageAlt: z.string().trim().min(1).max(140).optional(),
    title: z.string().trim().max(140).optional(),
    description: z.string().trim().max(300).optional(),
    sortOrder: z.coerce.number().int().default(0),
    isActive: z.coerce.boolean().default(true),
});
//# sourceMappingURL=homepage.schemas.js.map