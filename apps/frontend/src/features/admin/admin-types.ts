import type {
  AdminProductVariant,
  AdminTaxonomy,
  HomepageSettings,
} from "./admin-api.js";

export type AdminPanel =
  | "overview"
  | "products"
  | "categories"
  | "brands"
  | "homepage"
  | "users"
  | "orders";

export const orderStatuses = [
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "out-for-delivery",
  "delivered",
  "cancelled",
] as const;

export type TaxonomyForm = {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  isFeatured: boolean;
};

export const emptyTaxonomyForm: TaxonomyForm = {
  name: "",
  slug: "",
  description: "",
  isActive: true,
  isFeatured: false,
};

export type ProductForm = {
  name: string;
  slug: string;
  sku: string;
  price: number;
  compareAtPrice: number;
  stockQuantity: number;
  description: string;
  shortDescription: string;
  categoryId: string;
  brandId: string;
  isPublished: boolean;
  variants: AdminProductVariant[];
};

export const emptyProductForm: ProductForm = {
  name: "",
  slug: "",
  sku: "",
  price: 0,
  compareAtPrice: 0,
  stockQuantity: 0,
  description: "",
  shortDescription: "",
  categoryId: "",
  brandId: "",
  isPublished: true,
  variants: [],
};

export const defaultHomepageForm: HomepageSettings = {
  whyChooseUs: [
    {
      title: "Fresh selection",
      description: "Curated everyday essentials with clear category paths.",
    },
    {
      title: "Secure checkout",
      description: "Protected account and order flows from cart to delivery.",
    },
    {
      title: "Responsive support",
      description:
        "Policy and service messaging stays visible on the storefront.",
    },
  ],
  popularProductIds: [],
  bestSellingProductIds: [],
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateSkuFromName(value: string): string {
  const words = value
    .toUpperCase()
    .replace(/[^A-Z0-9\s]+/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return words
    .slice(0, 4)
    .map((word) => word.slice(0, 5))
    .join("-");
}

export function toTaxonomyPayload(form: TaxonomyForm): Partial<AdminTaxonomy> {
  const payload: Partial<AdminTaxonomy> = {
    name: form.name,
    slug: form.slug,
    isActive: form.isActive,
    isFeatured: form.isFeatured,
  };

  if (form.description) {
    payload.description = form.description;
  }

  return payload;
}
