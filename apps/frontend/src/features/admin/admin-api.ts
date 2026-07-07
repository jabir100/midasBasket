import { apiClient } from "../../shared/http/api-client.js";

export type AdminSummary = {
  users: {
    totalUsers: number;
    totalCustomers: number;
    totalAdmins: number;
    blockedUsers: number;
  };
  orders: {
    totalOrders: number;
    recentOrders: number;
    statusBreakdown: { status: string; count: number }[];
  };
  revenue: {
    currency: string;
    lifetime: number;
    last7Days: number;
  };
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "admin" | "customer";
  status: "active" | "blocked";
  createdAt?: string;
  updatedAt?: string;
};

export type AdminOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  paymentStatus: string;
  total: number;
  currency: string;
  createdAt?: string;
};

export type AuditLog = {
  id: string;
  actorUserId: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: unknown;
  createdAt?: string;
};

type ApiSuccess<TData> = {
  success: true;
  data: TData;
  requestId: string;
  meta?: Record<string, unknown>;
};

export async function getAdminSummary(): Promise<AdminSummary> {
  const response = await apiClient.get<ApiSuccess<AdminSummary>>(
    "/admin/dashboard/summary",
  );
  return response.data.data;
}

export async function listAdminUsers(input?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "blocked";
  role?: "admin" | "customer";
}): Promise<AdminUser[]> {
  const response = await apiClient.get<ApiSuccess<{ users: AdminUser[] }>>(
    "/admin/dashboard/users",
    { params: input },
  );
  return response.data.data.users;
}

export async function updateAdminUser(
  userId: string,
  input: { role?: "admin" | "customer"; status?: "active" | "blocked" },
): Promise<AdminUser> {
  const response = await apiClient.patch<ApiSuccess<{ user: AdminUser }>>(
    `/admin/dashboard/users/${userId}`,
    input,
  );
  return response.data.data.user;
}

export async function listAdminOrders(input?: {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
}): Promise<AdminOrder[]> {
  const response = await apiClient.get<ApiSuccess<{ orders: AdminOrder[] }>>(
    "/admin/dashboard/orders",
    { params: input },
  );
  return response.data.data.orders;
}

export async function updateOrderStatus(
  orderId: string,
  input: { status: string; paymentStatus?: string; note?: string },
): Promise<void> {
  await apiClient.patch(`/admin/dashboard/orders/${orderId}/status`, input);
}

export async function listAuditLogs(input?: {
  page?: number;
  limit?: number;
  action?: string;
}): Promise<AuditLog[]> {
  const response = await apiClient.get<ApiSuccess<{ logs: AuditLog[] }>>(
    "/admin/dashboard/audit-logs",
    { params: input },
  );
  return response.data.data.logs;
}

export type AdminCarouselSlide = {
  id: string;
  image: {
    url: string;
    alt: string;
    publicId?: string;
  };
  linkHref: string;
  title?: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export async function getAdminCarouselSlides(): Promise<AdminCarouselSlide[]> {
  const response = await apiClient.get<
    ApiSuccess<{ slides: AdminCarouselSlide[] }>
  >("/homepage/admin/carousel");
  return response.data.data.slides;
}

export async function createCarouselSlide(
  formData: FormData,
): Promise<AdminCarouselSlide> {
  const response = await apiClient.post<
    ApiSuccess<{ slide: AdminCarouselSlide }>
  >("/homepage/admin/carousel", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data.slide;
}

export async function deleteCarouselSlide(slideId: string): Promise<void> {
  await apiClient.delete(`/homepage/admin/carousel/${slideId}`);
}

export async function toggleCarouselSlideActive(
  slideId: string,
  isActive: boolean,
): Promise<AdminCarouselSlide> {
  const response = await apiClient.patch<
    ApiSuccess<{ slide: AdminCarouselSlide }>
  >(`/homepage/admin/carousel/${slideId}/toggle`, { isActive });
  return response.data.data.slide;
}

export type AdminProduct = {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  brandId: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  images: { url: string; alt: string; publicId?: string }[];
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt?: string;
};

export type AdminTaxonomy = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  isFeatured?: boolean;
};

export type HomepageLink = {
  href: string;
  label: string;
};

export type HomepageSettings = {
  hero?: {
    eyebrow?: string;
    title: string;
    description?: string;
    primaryAction?: HomepageLink;
    secondaryAction?: HomepageLink;
  };
  metrics?: { value: string; label: string }[];
  promoBanner?: {
    title: string;
    description?: string;
    action?: HomepageLink;
  };
  whyChooseUs?: { title: string; description?: string }[];
};

export type AdminTestimonial = {
  _id: string;
  customerName: string;
  quote: string;
  rating: number;
  isActive?: boolean;
  sortOrder?: number;
};

export async function listAdminProducts(): Promise<AdminProduct[]> {
  const response = await apiClient.get<
    ApiSuccess<{ products: AdminProduct[] }>
  >("/catalog/admin/products");
  return response.data.data.products;
}

export async function createAdminProduct(
  input: Partial<AdminProduct>,
): Promise<AdminProduct> {
  const response = await apiClient.post<ApiSuccess<{ product: AdminProduct }>>(
    "/catalog/admin/products",
    input,
  );
  return response.data.data.product;
}

export async function updateAdminProduct(
  productId: string,
  input: Partial<AdminProduct>,
): Promise<AdminProduct> {
  const response = await apiClient.patch<ApiSuccess<{ product: AdminProduct }>>(
    `/catalog/admin/products/${productId}`,
    input,
  );
  return response.data.data.product;
}

export async function deleteAdminProduct(productId: string): Promise<void> {
  await apiClient.delete(`/catalog/admin/products/${productId}`);
}

export async function listAdminCategories(): Promise<AdminTaxonomy[]> {
  const response = await apiClient.get<
    ApiSuccess<{ categories: AdminTaxonomy[] }>
  >("/catalog/admin/categories");
  return response.data.data.categories;
}

export async function createAdminCategory(
  input: Partial<AdminTaxonomy>,
): Promise<AdminTaxonomy> {
  const response = await apiClient.post<
    ApiSuccess<{ category: AdminTaxonomy }>
  >("/catalog/admin/categories", input);
  return response.data.data.category;
}

export async function updateAdminCategory(
  categoryId: string,
  input: Partial<AdminTaxonomy>,
): Promise<AdminTaxonomy> {
  const response = await apiClient.patch<
    ApiSuccess<{ category: AdminTaxonomy }>
  >(`/catalog/admin/categories/${categoryId}`, input);
  return response.data.data.category;
}

export async function deleteAdminCategory(categoryId: string): Promise<void> {
  await apiClient.delete(`/catalog/admin/categories/${categoryId}`);
}

export async function listAdminBrands(): Promise<AdminTaxonomy[]> {
  const response = await apiClient.get<ApiSuccess<{ brands: AdminTaxonomy[] }>>(
    "/catalog/admin/brands",
  );
  return response.data.data.brands;
}

export async function createAdminBrand(
  input: Partial<AdminTaxonomy>,
): Promise<AdminTaxonomy> {
  const response = await apiClient.post<ApiSuccess<{ brand: AdminTaxonomy }>>(
    "/catalog/admin/brands",
    input,
  );
  return response.data.data.brand;
}

export async function updateAdminBrand(
  brandId: string,
  input: Partial<AdminTaxonomy>,
): Promise<AdminTaxonomy> {
  const response = await apiClient.patch<ApiSuccess<{ brand: AdminTaxonomy }>>(
    `/catalog/admin/brands/${brandId}`,
    input,
  );
  return response.data.data.brand;
}

export async function deleteAdminBrand(brandId: string): Promise<void> {
  await apiClient.delete(`/catalog/admin/brands/${brandId}`);
}

export async function getHomepageSettings(): Promise<HomepageSettings> {
  const response = await apiClient.get<
    ApiSuccess<{ settings: HomepageSettings }>
  >("/homepage/admin/settings");
  return response.data.data.settings;
}

export async function updateHomepageSettings(
  input: HomepageSettings,
): Promise<HomepageSettings> {
  const response = await apiClient.put<
    ApiSuccess<{ settings: HomepageSettings }>
  >("/homepage/admin/settings", input);
  return response.data.data.settings;
}

export async function listAdminTestimonials(): Promise<AdminTestimonial[]> {
  const response = await apiClient.get<
    ApiSuccess<{ testimonials: AdminTestimonial[] }>
  >("/homepage/admin/testimonials");
  return response.data.data.testimonials;
}

export async function createAdminTestimonial(
  input: Partial<AdminTestimonial>,
): Promise<AdminTestimonial> {
  const response = await apiClient.post<
    ApiSuccess<{ testimonial: AdminTestimonial }>
  >("/homepage/admin/testimonials", input);
  return response.data.data.testimonial;
}

export async function updateAdminTestimonial(
  testimonialId: string,
  input: Partial<AdminTestimonial>,
): Promise<AdminTestimonial> {
  const response = await apiClient.patch<
    ApiSuccess<{ testimonial: AdminTestimonial }>
  >(`/homepage/admin/testimonials/${testimonialId}`, input);
  return response.data.data.testimonial;
}

export async function deleteAdminTestimonial(
  testimonialId: string,
): Promise<void> {
  await apiClient.delete(`/homepage/admin/testimonials/${testimonialId}`);
}
