import { apiClient } from "../../shared/http/api-client.js";

export type CatalogImage = {
  url: string;
  alt: string;
};

export type CatalogCategory = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: CatalogImage;
};

export type CatalogBrand = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: CatalogImage;
};

export type CatalogProduct = {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  images: CatalogImage[];
  tags: string[];
};

type ApiSuccess<TData> = {
  success: true;
  data: TData;
  meta?: { page: number; limit: number; total: number; pages: number };
  requestId: string;
};

export async function listCategories(): Promise<CatalogCategory[]> {
  const response = await apiClient.get<
    ApiSuccess<{ categories: CatalogCategory[] }>
  >("/catalog/categories");
  return response.data.data.categories;
}

export async function listBrands(): Promise<CatalogBrand[]> {
  const response =
    await apiClient.get<ApiSuccess<{ brands: CatalogBrand[] }>>(
      "/catalog/brands",
    );
  return response.data.data.brands;
}

export async function listProducts(
  params: URLSearchParams,
): Promise<{ products: CatalogProduct[]; total: number }> {
  const response = await apiClient.get<
    ApiSuccess<{ products: CatalogProduct[] }>
  >("/catalog/products", { params });
  return {
    products: response.data.data.products,
    total: response.data.meta?.total ?? response.data.data.products.length,
  };
}

export async function getProduct(slug: string): Promise<CatalogProduct> {
  const response = await apiClient.get<ApiSuccess<{ product: CatalogProduct }>>(
    `/catalog/products/${slug}`,
  );
  return response.data.data.product;
}
