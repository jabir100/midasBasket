import type { AdminTaxonomy, HomepageSettings } from "./admin-api.js";

export type AdminPanel =
  | "overview"
  | "products"
  | "categories"
  | "brands"
  | "homepage"
  | "users"
  | "orders"
  | "carousel";

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

export const defaultHomepageForm: HomepageSettings = {
  hero: {
    eyebrow: "Premium essentials, delivered fast",
    title: "Modern shopping for everyday wins",
    description:
      "A fast, secure, mobile-first ecommerce experience for curated products and trusted brands.",
    primaryAction: { href: "/products", label: "Shop products" },
    secondaryAction: { href: "/categories", label: "Browse categories" },
  },
  promoBanner: {
    title: "Weekend essentials, sharper prices",
    description:
      "Feature seasonal offers, policy-led promises, or campaign messages from here.",
    action: { href: "/products", label: "Explore offers" },
  },
  metrics: [
    { value: "2k+", label: "Curated products" },
    { value: "24h", label: "Fast dispatch target" },
    { value: "100%", label: "Secure checkout focus" },
  ],
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
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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
