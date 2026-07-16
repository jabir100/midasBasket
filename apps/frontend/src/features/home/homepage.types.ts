export type HomepageImage = {
  alt: string;
  blurDataUrl?: string;
  height: number;
  src: string;
  width: number;
};

export type HomepageLink = {
  href: string;
  label: string;
};

export type HomepageHeroBanner = {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction: HomepageLink;
  secondaryAction: HomepageLink;
  image: HomepageImage;
};

export type HomepageCategory = {
  id: string;
  name: string;
  slug: string;
  image: HomepageImage;
  productCount: number;
};

export type HomepageBrand = {
  id: string;
  name: string;
  slug: string;
  logo: HomepageImage;
};

export type HomepageProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  currency: "BDT";
  rating: number;
  reviewCount: number;
  image: HomepageImage;
  badge?: string;
};

export type HomepageValueProposition = {
  id: string;
  title: string;
  description: string;
};

export type HomepageCarouselSlide = {
  id: string;
  image: HomepageImage;
  linkHref: string;
  title?: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
};

export type HomepagePayload = {
  carousel: HomepageCarouselSlide[];
  hero: HomepageHeroBanner;
  featuredCategories: HomepageCategory[];
  popularProducts: HomepageProduct[];
  bestSellingProducts: HomepageProduct[];
  featuredBrands: HomepageBrand[];
  whyChooseUs: HomepageValueProposition[];
  generatedAt: string;
};
