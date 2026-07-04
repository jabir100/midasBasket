import { createFileRoute } from "@tanstack/react-router";

import { ProductDetailPage } from "../../features/catalog/catalog-pages.js";
import {
  canonicalLink,
  humanizeSlug,
  indexFollowMeta,
  toAbsoluteUrl,
} from "../../shared/seo/seo.js";

export const Route = createFileRoute("/products/$slug")({
  head: ({ params }) => {
    const productName = humanizeSlug(params.slug);
    const path = `/products/${params.slug}`;

    return {
      meta: [
        { title: `${productName} | Midas Basket` },
        {
          name: "description",
          content: `View ${productName} details, pricing, and availability on Midas Basket.`,
        },
        indexFollowMeta,
        { property: "og:title", content: `${productName} | Midas Basket` },
        {
          property: "og:description",
          content: `Explore ${productName} and related premium catalog options on Midas Basket.`,
        },
        { property: "og:type", content: "product" },
        { property: "og:url", content: toAbsoluteUrl(path) },
      ],
      links: [canonicalLink(path)],
    };
  },
  component: ProductRoute,
});

function ProductRoute() {
  const { slug } = Route.useParams();
  return <ProductDetailPage slug={slug} />;
}
