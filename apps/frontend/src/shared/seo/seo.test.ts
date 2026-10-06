import { afterEach, describe, expect, it, vi } from "vitest";

describe("SEO helpers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("builds absolute and canonical URLs from the configured site URL", async () => {
    vi.stubEnv("VITE_PUBLIC_SITE_URL", "https://midas.example.com/store/");

    const { canonicalLink, toAbsoluteUrl } = await import("./seo.js");

    expect(toAbsoluteUrl("/")).toBe("https://midas.example.com/store");
    expect(toAbsoluteUrl("products/linen-shirt")).toBe(
      "https://midas.example.com/store/products/linen-shirt",
    );
    expect(canonicalLink("/brands")).toEqual({
      rel: "canonical",
      href: "https://midas.example.com/store/brands",
    });
  });

  it("humanizes URL slugs for metadata text", async () => {
    const { humanizeSlug } = await import("./seo.js");

    expect(humanizeSlug("summer-linen-collection")).toBe(
      "Summer Linen Collection",
    );
    expect(humanizeSlug("-featured--brands-")).toBe("Featured Brands");
  });

  it("re-serves Cloudinary product images as 1200x630 JPEG cards", async () => {
    const { toSocialImage } = await import("./seo.js");

    expect(
      toSocialImage({
        url: "https://res.cloudinary.com/demo/image/upload/v1/midas-basket/products/shirt.webp",
        alt: "Linen shirt",
      }),
    ).toEqual({
      url: "https://res.cloudinary.com/demo/image/upload/c_pad,b_white,w_1200,h_630,f_jpg,q_auto/v1/midas-basket/products/shirt.webp",
      alt: "Linen shirt",
      width: 1200,
      height: 630,
    });
  });

  it("passes other images through as absolute URLs without dimensions", async () => {
    vi.stubEnv("VITE_PUBLIC_SITE_URL", "https://midas.example.com");

    const { toSocialImage } = await import("./seo.js");

    expect(toSocialImage({ url: "/images/shirt.jpg", alt: " " })).toEqual({
      url: "https://midas.example.com/images/shirt.jpg",
      alt: "Midas Basket",
    });
    expect(toSocialImage({ url: "https://cdn.example.com/a.png" }).url).toBe(
      "https://cdn.example.com/a.png",
    );
  });

  it("builds page tags with the default share image", async () => {
    vi.stubEnv("VITE_PUBLIC_SITE_URL", "https://midas.example.com");

    const { pageSeo } = await import("./seo.js");
    const seo = pageSeo({
      title: "Brands | Midas Basket",
      description: "Browse brands.",
      path: "/brands",
    });

    expect(seo.links).toEqual([
      { rel: "canonical", href: "https://midas.example.com/brands" },
    ]);
    expect(seo.meta).toEqual(
      expect.arrayContaining([
        { property: "og:url", content: "https://midas.example.com/brands" },
        {
          property: "og:image",
          content: "https://midas.example.com/og-image.jpg",
        },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        {
          name: "twitter:image",
          content: "https://midas.example.com/og-image.jpg",
        },
        { name: "twitter:card", content: "summary_large_image" },
      ]),
    );
  });
});
