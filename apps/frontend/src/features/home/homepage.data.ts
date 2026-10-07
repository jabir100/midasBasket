import type { HomepagePayload } from "./homepage.types.js";

const placeholderImage = {
  src: "/images/homepage/placeholder.webp",
  alt: "Midas Basket premium product placeholder",
  width: 1200,
  height: 900,
} as const;

const products = [
  {
    id: "prod-olive-oil",
    name: "Premium Olive Oil",
    slug: "premium-olive-oil",
    price: 890,
    compareAtPrice: 1050,
    stockQuantity: 34,
    currency: "BDT",
    rating: 4.8,
    reviewCount: 124,
    image: placeholderImage,
    badge: "Best Seller",
  },
  {
    id: "prod-ground-coffee",
    name: "Signature Ground Coffee",
    slug: "signature-ground-coffee",
    price: 650,
    stockQuantity: 6,
    currency: "BDT",
    rating: 4.7,
    reviewCount: 88,
    image: placeholderImage,
    badge: "New",
  },
  {
    id: "prod-skin-serum",
    name: "Daily Glow Serum",
    slug: "daily-glow-serum",
    price: 1250,
    compareAtPrice: 1480,
    stockQuantity: 0,
    currency: "BDT",
    rating: 4.9,
    reviewCount: 67,
    image: placeholderImage,
    badge: "Flash Sale",
  },
  {
    id: "prod-laundry-care",
    name: "Soft Care Laundry Pack",
    slug: "soft-care-laundry-pack",
    price: 540,
    stockQuantity: 58,
    currency: "BDT",
    rating: 4.6,
    reviewCount: 41,
    image: placeholderImage,
  },
] as const;

export const homepagePreviewData: HomepagePayload = {
  carousel: [],
  hero: {
    eyebrow: "Groceries and everyday essentials",
    title: "Everything for your basket, delivered",
    description:
      "Shop groceries, home care, and beauty from brands you know. Pay cash on delivery.",
    primaryAction: { href: "/products", label: "Shop products" },
    secondaryAction: { href: "/offers", label: "View offers" },
    image: placeholderImage,
  },
  featuredCategories: [
    {
      id: "cat-grocery",
      name: "Grocery",
      slug: "grocery",
      image: placeholderImage,
      productCount: 128,
    },
    {
      id: "cat-home",
      name: "Home",
      slug: "home",
      image: placeholderImage,
      productCount: 74,
    },
    {
      id: "cat-beauty",
      name: "Beauty",
      slug: "beauty",
      image: placeholderImage,
      productCount: 56,
    },
  ],
  popularProducts: [...products],
  bestSellingProducts: [products[0], products[2], products[1]],
  featuredBrands: [
    { id: "brand-aura", name: "Aura", slug: "aura", logo: placeholderImage },
    {
      id: "brand-nova",
      name: "Nova Goods",
      slug: "nova-goods",
      logo: placeholderImage,
    },
    { id: "brand-luma", name: "Luma", slug: "luma", logo: placeholderImage },
    {
      id: "brand-mono",
      name: "Mono Home",
      slug: "mono-home",
      logo: placeholderImage,
    },
  ],
  whyChooseUs: [
    {
      id: "cash-on-delivery",
      title: "Cash on delivery",
      description:
        "Pay when your order arrives. No card needed.",
    },
    {
      id: "tracking",
      title: "Order tracking",
      description:
        "Follow every order from packing to your door with a tracking code.",
    },
    {
      id: "brands",
      title: "Brands you know",
      description:
        "Products from established brands, sorted by category so they are easy to find.",
    },
  ],
  generatedAt: new Date(0).toISOString(),
};
