import { ArrowRight, BadgeCheck, Search, Sparkles, Store, Truck } from "lucide-react";
import type { ReactNode } from "react";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@heroui/react";
import { Badge } from "../../shared/ui/badge.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { Chip } from "../../shared/ui/chip.js";
import { toAbsoluteUrl } from "../../shared/seo/seo.js";
import { HomeCarousel } from "./home-carousel.js";
import { fetchHomepage } from "./homepage-api.js";
import { ProductSlider } from "./product-slider.js";

const formatter = new Intl.NumberFormat("en-BD", {
  currency: "BDT",
  maximumFractionDigits: 0,
  style: "currency",
});

export function HomeFoundationPage(): ReactNode {
  const { data: homepage, isLoading } = useQuery({
    queryKey: ["homepage"],
    queryFn: fetchHomepage,
  });
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Midas Basket",
    url: toAbsoluteUrl("/"),
    logo: toAbsoluteUrl("/favicon.svg"),
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Midas Basket",
    url: toAbsoluteUrl("/"),
    potentialAction: {
      "@type": "SearchAction",
      target: `${toAbsoluteUrl("/products")}?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  if (isLoading || !homepage) {
    return (
      <main>
        <script type="application/ld+json">
          {JSON.stringify(organizationJsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(websiteJsonLd)}
        </script>
        <HomePageSkeleton />
      </main>
    );
  }

  return (
    <main>
      <script type="application/ld+json">
        {JSON.stringify(organizationJsonLd)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteJsonLd)}
      </script>
      {homepage.carousel.length > 0 ? (
        <HomeCarousel slides={homepage.carousel} />
      ) : (
        <section className="home-hero" aria-labelledby="home-title">
          <div className="home-hero-copy">
            <Chip startContent={<Sparkles aria-hidden="true" size={16} />}>
              {homepage.hero.eyebrow}
            </Chip>
            <h1 id="home-title">{homepage.hero.title}</h1>
            <p>{homepage.hero.description}</p>
            <div className="hero-actions">
              <a
                className="ui-button ui-button-primary"
                href={homepage.hero.primaryAction.href}
              >
                {homepage.hero.primaryAction.label}
                <ArrowRight aria-hidden="true" size={18} />
              </a>
              <a
                className="ui-button ui-button-secondary"
                href={homepage.hero.secondaryAction.href}
              >
                {homepage.hero.secondaryAction.label}
              </a>
            </div>
          </div>

          <aside
            className="home-hero-panel"
            aria-label="Featured shopping tools"
          >
            <div className="hero-search-card">
              <Search aria-hidden="true" size={20} />
              <span>Search products, categories, and brands</span>
            </div>
            {homepage.popularProducts[0] ? (
              <div className="hero-product-card">
                <Badge>Featured</Badge>
                <strong>{homepage.popularProducts[0].name}</strong>
                <span>{formatter.format(homepage.popularProducts[0].price)}</span>
              </div>
            ) : null}
            <div className="hero-service-row">
              <span>
                <Truck aria-hidden="true" size={18} /> Fast dispatch
              </span>
              <span>
                <BadgeCheck aria-hidden="true" size={18} /> Secure checkout
              </span>
            </div>
          </aside>
        </section>
      )}

      <section
        className="home-section"
        aria-labelledby="featured-categories-title"
      >
        <SectionHeading
          eyebrow="Shop by need"
          title="Featured categories"
          action={{ href: "/categories", label: "All categories" }}
        />
        <div className="category-grid">
          {homepage.featuredCategories.map((category) => (
            <a
              className="category-card"
              href={`/categories/${category.slug}`}
              key={category.id}
            >
              <span>{category.name}</span>
              <strong>{category.productCount} products</strong>
            </a>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="brands-title">
        <SectionHeading
          eyebrow="Featured brands"
          title="Trusted names for every basket"
          action={{ href: "/brands", label: "All brands" }}
        />
        <div className="brand-grid">
          {homepage.featuredBrands.map((brand) => (
            <a
              href={`/brands/${brand.slug}`}
              className="brand-card"
              key={brand.id}
            >
              {brand.name}
            </a>
          ))}
        </div>
      </section>

      {homepage.popularProducts.length > 0 ? (
        <section
          className="home-section"
          aria-labelledby="popular-products-title"
        >
          <SectionHeading
            eyebrow="Curated picks"
            title="Popular products"
            action={{ href: "/products", label: "View products" }}
          />
          <ProductSlider products={homepage.popularProducts} />
        </section>
      ) : null}

      {homepage.bestSellingProducts.length > 0 ? (
        <section
          className="home-section"
          aria-labelledby="best-selling-products-title"
        >
          <SectionHeading
            eyebrow="Customer favorites"
            title="Most selling"
            action={{ href: "/products", label: "View products" }}
          />
          <ProductSlider products={homepage.bestSellingProducts} />
        </section>
      ) : null}

      <section
        className="home-section split-section"
        aria-labelledby="why-title"
      >
        <div>
          <span className="section-eyebrow">Why choose us</span>
          <h2 id="why-title">Premium shopping, engineered quietly</h2>
        </div>
        <div className="value-grid">
          {homepage.whyChooseUs.map((item) => (
            <Card className="value-card" key={item.id}>
              <CardBody>
                <Store aria-hidden="true" size={20} />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <strong>Midas Basket</strong>
        <span>Fast, secure, premium ecommerce foundation.</span>
      </footer>
    </main>
  );
}

function HomePageSkeleton(): ReactNode {
  return (
    <div aria-busy="true" aria-live="polite">
      <section className="home-hero" aria-hidden="true">
        <div className="home-hero-copy">
          <Skeleton className="h-9 w-52 rounded-full" />
          <div className="space-y-3">
            <Skeleton className="h-20 w-full max-w-3xl rounded-2xl" />
            <Skeleton className="h-20 w-full max-w-2xl rounded-2xl" />
          </div>
          <Skeleton className="h-6 w-full max-w-xl rounded-full" />
          <div className="hero-actions">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-36 rounded-full" />
          </div>
          <div className="home-metrics" aria-hidden="true">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        </div>

        <aside className="home-hero-panel" aria-hidden="true">
          <Skeleton className="h-20 w-full rounded-3xl" />
          <Skeleton className="h-28 w-full rounded-3xl" />
          <Skeleton className="h-20 w-full rounded-3xl" />
        </aside>
      </section>
    </div>
  );
}

function SectionHeading({
  action,
  eyebrow,
  title,
}: Readonly<{
  action?: { href: string; label: string };
  eyebrow: string;
  title: string;
}>): ReactNode {
  return (
    <div className="section-heading">
      <div>
        <span className="section-eyebrow">{eyebrow}</span>
        <h2 id={`${title.toLowerCase().replaceAll(" ", "-")}-title`}>
          {title}
        </h2>
      </div>
      {action ? <a href={action.href}>{action.label}</a> : null}
    </div>
  );
}

