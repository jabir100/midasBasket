import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Expected a MongoDB object id");
const slug = z
  .string()
  .trim()
  .min(2)
  .max(140)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const seo = z.object({
  title: z.string().trim().max(70).optional(),
  description: z.string().trim().max(170).optional(),
});
const image = z.object({
  url: z.string().trim().url(),
  alt: z.string().trim().min(2).max(140),
  publicId: z.string().trim().min(1).optional(),
  color: z.string().trim().min(1).max(40).optional(),
});
const variant = z.object({
  size: z.string().trim().min(1).max(20),
  color: z.string().trim().min(1).max(40),
  stockQuantity: z.number().int().nonnegative(),
  sku: z.string().trim().max(80).optional(),
});

export const MAX_PRODUCT_IMAGES = 8;

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug,
  description: z.string().trim().max(600).optional(),
  image: image.optional(),
  seo: seo.optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const brandSchema = categorySchema
  .extend({ logo: image.optional() })
  .omit({ image: true });

export const productSchema = z.object({
  name: z.string().trim().min(2).max(180),
  slug,
  sku: z.string().trim().min(2).max(80),
  description: z.string().trim().min(20).max(5_000),
  shortDescription: z.string().trim().max(300).optional(),
  categoryId: objectId,
  brandId: objectId,
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().optional(),
  // Only meaningful when `variants` is empty (legacy no-variant products);
  // ignored/overwritten server-side whenever variants are present.
  stockQuantity: z.number().int().nonnegative().optional(),
  variants: z
    .array(variant)
    .max(60)
    .optional()
    .refine(
      (variants) =>
        !variants ||
        new Set(variants.map((v) => `${v.size}|${v.color}`)).size ===
          variants.length,
      { message: "Duplicate size+color combination in variants" },
    ),
  images: z.array(image).max(MAX_PRODUCT_IMAGES).optional(),
  seo: seo.optional(),
  tags: z.array(z.string().trim().min(1).max(60)).max(24).optional(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
  search: z.string().trim().min(1).max(120).optional(),
  category: slug.optional(),
  brand: slug.optional(),
  sort: z.enum(["newest", "price-asc", "price-desc"]).default("newest"),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type BrandInput = z.infer<typeof brandSchema>;
export type ProductInput = z.infer<typeof productSchema>;
