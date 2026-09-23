/**
 * Allow-list serializers for the public (unauthenticated) catalog API.
 *
 * Public routes must never return raw Mongoose documents: they carry
 * storage details (Cloudinary `publicId`, `__v`), admin flags, and
 * timestamps, and any field added to a model later would leak automatically.
 * Every field returned here is chosen explicitly.
 */

/** The storefront only distinguishes out of stock (0), low stock (<= 10), and in stock. */
export const LOW_STOCK_THRESHOLD = 10;
const PUBLIC_STOCK_CAP = LOW_STOCK_THRESHOLD + 1;

/**
 * Hides exact inventory from public responses. Anything above the low-stock
 * threshold is reported as the cap, so real stock levels are only visible
 * while an item is already flagged "low stock".
 */
export function toPublicStock(stockQuantity: number): number {
  return Math.min(Math.max(stockQuantity, 0), PUBLIC_STOCK_CAP);
}

type ImageSource = {
  url: string;
  alt: string;
  color?: string | null | undefined;
};

type VariantSource = {
  size: string;
  color: string;
  stockQuantity: number;
};

type CategorySource = {
  _id: unknown;
  name: string;
  slug: string;
  description?: string | null | undefined;
  image?: ImageSource | null | undefined;
};

type BrandSource = {
  _id: unknown;
  name: string;
  slug: string;
  description?: string | null | undefined;
  logo?: ImageSource | null | undefined;
};

type ProductSource = {
  _id: unknown;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string | null | undefined;
  price: number;
  compareAtPrice?: number | null | undefined;
  stockQuantity: number;
  variants?: VariantSource[] | null | undefined;
  images?: ImageSource[] | null | undefined;
  tags?: string[] | null | undefined;
};

export type PublicImage = { url: string; alt: string; color?: string };

export type PublicCategory = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: PublicImage;
};

export type PublicBrand = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: PublicImage;
};

export type PublicProduct = {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  variants: { size: string; color: string; stockQuantity: number }[];
  images: PublicImage[];
  tags: string[];
};

export function toPublicImage(image: ImageSource): PublicImage {
  return {
    url: image.url,
    alt: image.alt,
    ...(image.color ? { color: image.color } : {}),
  };
}

export function toPublicCategory(category: CategorySource): PublicCategory {
  return {
    _id: String(category._id),
    name: category.name,
    slug: category.slug,
    ...(category.description ? { description: category.description } : {}),
    ...(category.image ? { image: toPublicImage(category.image) } : {}),
  };
}

export function toPublicBrand(brand: BrandSource): PublicBrand {
  return {
    _id: String(brand._id),
    name: brand.name,
    slug: brand.slug,
    ...(brand.description ? { description: brand.description } : {}),
    ...(brand.logo ? { logo: toPublicImage(brand.logo) } : {}),
  };
}

export function toPublicProduct(product: ProductSource): PublicProduct {
  return {
    _id: String(product._id),
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    ...(product.shortDescription
      ? { shortDescription: product.shortDescription }
      : {}),
    price: product.price,
    ...(product.compareAtPrice
      ? { compareAtPrice: product.compareAtPrice }
      : {}),
    stockQuantity: toPublicStock(product.stockQuantity),
    variants: (product.variants ?? []).map((variant) => ({
      size: variant.size,
      color: variant.color,
      stockQuantity: toPublicStock(variant.stockQuantity),
    })),
    images: (product.images ?? []).map(toPublicImage),
    tags: product.tags ?? [],
  };
}
