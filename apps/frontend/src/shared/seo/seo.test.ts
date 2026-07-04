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
});
