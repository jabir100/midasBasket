import { createFileRoute, notFound } from "@tanstack/react-router";

import { getProduct } from "../../features/catalog/catalog-api.js";
import { ProductDetailPage } from "../../features/catalog/catalog-pages.js";
import { isNotFoundError } from "../../shared/http/api-client.js";
import { humanizeSlug, pageSeo, toSocialImage } from "../../shared/seo/seo.js";
import { NotFoundPage } from "../../shared/ui/status-pages.js";

const MAX_DESCRIPTION_LENGTH = 160;

function toMetaDescription(text: string): string {
  const normalized = text.replace(/\s+/g, " ").trim();

  return normalized.length > MAX_DESCRIPTION_LENGTH
    ? `${normalized.slice(0, MAX_DESCRIPTION_LENGTH - 1).trimEnd()}…`
    : normalized;
}

export const Route = createFileRoute("/products/$slug")({
  /*
   * Runs on the server for the first request so the product is rendered into
   * the HTML. An unknown slug becomes a real 404, which also keeps bogus URLs
   * out of the ISR cache. Other failures are rethrown so an API outage is
   * never cached as a page.
   */
  loader: async ({ params }) => {
    try {
      return await getProduct(params.slug);
    } catch (error) {
      if (isNotFoundError(error)) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error -- TanStack Router's not-found signal
        throw notFound();
      }

      throw error;
    }
  },
  staleTime: Number.POSITIVE_INFINITY,
  head: ({ params, loaderData }) => {
    const path = `/products/${params.slug}`;

    if (!loaderData) {
      const productName = humanizeSlug(params.slug);

      return pageSeo({
        title: `${productName} | Midas Basket`,
        description: `View ${productName} details, pricing, and availability on Midas Basket.`,
        path,
      });
    }

    const firstImage = loaderData.images[0];
    const seo = pageSeo({
      title: `${loaderData.name} | Midas Basket`,
      description: toMetaDescription(
        loaderData.shortDescription ?? loaderData.description,
      ),
      path,
      type: "product",
      ...(firstImage
        ? {
            image: toSocialImage({
              url: firstImage.url,
              alt: firstImage.alt || loaderData.name,
            }),
          }
        : {}),
    });

    return {
      ...seo,
      meta: [
        ...seo.meta,
        {
          property: "product:price:amount",
          content: loaderData.price.toFixed(2),
        },
        { property: "product:price:currency", content: "BDT" },
        {
          property: "product:availability",
          content: loaderData.stockQuantity > 0 ? "in stock" : "out of stock",
        },
        // Shown as a label/value row by Slack and Discord link unfurls.
        { name: "twitter:label1", content: "Price" },
        {
          name: "twitter:data1",
          content: `৳${loaderData.price.toLocaleString("en-BD")}`,
        },
      ],
    };
  },
  notFoundComponent: ProductNotFound,
  component: ProductRoute,
});

function ProductRoute() {
  const { slug } = Route.useParams();
  const product = Route.useLoaderData();
  return <ProductDetailPage slug={slug} initialProduct={product} />;
}

function ProductNotFound() {
  return (
    <NotFoundPage
      title="Product not found"
      description="This product may have been removed or is no longer available."
    />
  );
}
