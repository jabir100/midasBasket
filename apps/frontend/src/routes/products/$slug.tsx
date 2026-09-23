import { createFileRoute, notFound } from "@tanstack/react-router";

import { getProduct } from "../../features/catalog/catalog-api.js";
import { ProductDetailPage } from "../../features/catalog/catalog-pages.js";
import { isNotFoundError } from "../../shared/http/api-client.js";
import {
  canonicalLink,
  humanizeSlug,
  indexFollowMeta,
  toAbsoluteUrl,
} from "../../shared/seo/seo.js";

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
    const productName = loaderData?.name ?? humanizeSlug(params.slug);
    const description = loaderData
      ? toMetaDescription(loaderData.shortDescription ?? loaderData.description)
      : `View ${productName} details, pricing, and availability on Midas Basket.`;
    const image = loaderData?.images[0]?.url;
    const path = `/products/${params.slug}`;

    return {
      meta: [
        { title: `${productName} | Midas Basket` },
        { name: "description", content: description },
        indexFollowMeta,
        { property: "og:title", content: `${productName} | Midas Basket` },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: toAbsoluteUrl(path) },
        ...(image ? [{ property: "og:image", content: image }] : []),
      ],
      links: [canonicalLink(path)],
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
    <main className="page-shell">
      <p className="form-error">Product was not found.</p>
    </main>
  );
}
