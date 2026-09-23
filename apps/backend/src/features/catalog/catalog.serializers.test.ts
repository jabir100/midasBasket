import { describe, expect, it } from "vitest";

import {
  toPublicBrand,
  toPublicCategory,
  toPublicProduct,
  toPublicStock,
} from "./catalog.serializers.js";

const storedImage = {
  url: "https://res.cloudinary.com/demo/image/upload/v1/a.webp",
  alt: "Front view",
  publicId: "midas-basket/catalog/products/a",
  color: "Red",
};

describe("toPublicStock", () => {
  it("keeps out of stock at zero and never goes negative", () => {
    expect(toPublicStock(0)).toBe(0);
    expect(toPublicStock(-4)).toBe(0);
  });

  it("reports real numbers while an item is low on stock", () => {
    expect(toPublicStock(1)).toBe(1);
    expect(toPublicStock(10)).toBe(10);
  });

  it("hides exact inventory above the low-stock threshold", () => {
    expect(toPublicStock(11)).toBe(11);
    expect(toPublicStock(4_812)).toBe(11);
  });
});

describe("toPublicProduct", () => {
  const stored = {
    _id: { toString: () => "665f1c2ab3c4d5e6f7a8b9c0" },
    __v: 3,
    name: "Linen Shirt",
    slug: "linen-shirt",
    sku: "MB-LIN-001",
    description: "A shirt.",
    categoryId: "665f1c2ab3c4d5e6f7a8b9c1",
    brandId: "665f1c2ab3c4d5e6f7a8b9c2",
    price: 1200,
    stockQuantity: 500,
    variants: [{ size: "M", color: "Red", stockQuantity: 250, sku: "V-1" }],
    images: [storedImage],
    seo: { title: "t" },
    tags: ["summer"],
    isFeatured: true,
    isPublished: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("returns only allow-listed fields", () => {
    const result = toPublicProduct(stored);

    expect(Object.keys(result).sort()).toEqual([
      "_id",
      "description",
      "images",
      "name",
      "price",
      "sku",
      "slug",
      "stockQuantity",
      "tags",
      "variants",
    ]);
    expect(result._id).toBe("665f1c2ab3c4d5e6f7a8b9c0");
  });

  it("strips storage details from images and variants", () => {
    const result = toPublicProduct(stored);

    expect(result.images).toEqual([
      { url: storedImage.url, alt: "Front view", color: "Red" },
    ]);
    expect(result.variants).toEqual([
      { size: "M", color: "Red", stockQuantity: 11 },
    ]);
    expect(JSON.stringify(result)).not.toContain("publicId");
    expect(JSON.stringify(result)).not.toContain("__v");
  });

  it("caps public stock counts", () => {
    expect(toPublicProduct(stored).stockQuantity).toBe(11);
  });

  it("includes optional fields only when present", () => {
    const result = toPublicProduct({
      ...stored,
      shortDescription: "Short",
      compareAtPrice: 1500,
    });

    expect(result.shortDescription).toBe("Short");
    expect(result.compareAtPrice).toBe(1500);
  });
});

describe("toPublicCategory / toPublicBrand", () => {
  it("returns only allow-listed category fields", () => {
    const result = toPublicCategory({
      _id: "c1",
      name: "Shirts",
      slug: "shirts",
      description: "All shirts",
      image: storedImage,
      isActive: true,
      isFeatured: true,
      seo: { title: "x" },
      createdAt: new Date(),
    } as Parameters<typeof toPublicCategory>[0]);

    expect(result).toEqual({
      _id: "c1",
      name: "Shirts",
      slug: "shirts",
      description: "All shirts",
      image: { url: storedImage.url, alt: "Front view", color: "Red" },
    });
  });

  it("returns only allow-listed brand fields", () => {
    const result = toPublicBrand({
      _id: "b1",
      name: "Midas",
      slug: "midas",
      logo: { url: storedImage.url, alt: "Logo", publicId: "secret-id" },
    } as Parameters<typeof toPublicBrand>[0]);

    expect(result).toEqual({
      _id: "b1",
      name: "Midas",
      slug: "midas",
      logo: { url: storedImage.url, alt: "Logo" },
    });
  });
});
