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

export type HomepageMetric = {
  label: string;
  value: string;
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
  currency: "BDT";
  rating: number;
  reviewCount: number;
  image: HomepageImage;
  badge?: string;
};

export type HomepageBlogPreview = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  image: HomepageImage;
};

export type HomepageTestimonial = {
  id: string;
  customerName: string;
  quote: string;
  rating: number;
};

export type HomepageValueProposition = {
  id: string;
  title: string;
  description: string;
};

export type HomepagePromoBanner = {
  title: string;
  description: string;
  action: HomepageLink;
};

export type HomepagePayload = {
  hero: HomepageHeroBanner;
  metrics: HomepageMetric[];
  featuredCategories: HomepageCategory[];
  featuredProducts: HomepageProduct[];
  flashSaleProducts: HomepageProduct[];
  trendingProducts: HomepageProduct[];
  bestSellers: HomepageProduct[];
  newestProducts: HomepageProduct[];
  featuredBrands: HomepageBrand[];
  promoBanner: HomepagePromoBanner;
  whyChooseUs: HomepageValueProposition[];
  testimonials: HomepageTestimonial[];
  latestBlogs: HomepageBlogPreview[];
  generatedAt: string;
};
