import { createFileRoute } from "@tanstack/react-router";

import { HomeFoundationPage } from "../features/home/home-foundation-page.js";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Midas Basket | Premium Online Shopping" },
      {
        name: "description",
        content:
          "Shop curated essentials, featured brands, flash sale products, and premium everyday finds from Midas Basket.",
      },
      {
        name: "keywords",
        content:
          "Midas Basket, ecommerce, online shopping, featured products, flash sale, Bangladesh",
      },
      {
        property: "og:title",
        content: "Midas Basket | Premium Online Shopping",
      },
      {
        property: "og:description",
        content:
          "A fast, secure, mobile-first ecommerce experience for curated products and trusted brands.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomeFoundationPage,
});
