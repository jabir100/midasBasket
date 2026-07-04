import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Mail,
  PackageSearch,
  Search,
  Sparkles,
  Star,
  Store,
  Truck,
} from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "../../shared/ui/badge.js";
import { Button } from "../../shared/ui/button.js";
import { Card, CardBody } from "../../shared/ui/card.js";
import { Chip } from "../../shared/ui/chip.js";
import { toAbsoluteUrl } from "../../shared/seo/seo.js";
import { homepagePreviewData } from "./homepage.data.js";
import type { HomepageProduct } from "./homepage.types.js";

const formatter = new Intl.NumberFormat("en-BD", {
  currency: "BDT",
  maximumFractionDigits: 0,
  style: "currency",
});

export function HomeFoundationPage(): ReactNode {
  const homepage = homepagePreviewData;
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

  return (
    <main>
      <script type="application/ld+json">
        {JSON.stringify(organizationJsonLd)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteJsonLd)}
      </script>
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
          <dl className="home-metrics" aria-label="Midas Basket highlights">
            {homepage.metrics.map((metric) => (
              <div key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <aside className="home-hero-panel" aria-label="Featured shopping tools">
          <div className="hero-search-card">
            <Search aria-hidden="true" size={20} />
            <span>Search products, categories, and brands</span>
          </div>
          <div className="hero-product-card">
            <Badge>Featured</Badge>
            <strong>{homepage.featuredProducts[0]?.name}</strong>
            <span>{formatPrice(homepage.featuredProducts[0])}</span>
          </div>
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

      <ProductRail
        eyebrow="Curated picks"
        title="Featured products"
        products={homepage.featuredProducts}
      />
      <ProductRail
        eyebrow="Limited-time value"
        title="Flash sale"
        products={homepage.flashSaleProducts}
        compact
      />
      <ProductRail
        eyebrow="What shoppers are viewing"
        title="Trending products"
        products={homepage.trendingProducts}
      />

      <section className="promo-band" aria-labelledby="promo-title">
        <div>
          <span>Promotion</span>
          <h2 id="promo-title">{homepage.promoBanner.title}</h2>
          <p>{homepage.promoBanner.description}</p>
        </div>
        <a
          className="ui-button ui-button-primary"
          href={homepage.promoBanner.action.href}
        >
          {homepage.promoBanner.action.label}
        </a>
      </section>

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

      <ProductRail
        eyebrow="Customer favorites"
        title="Best sellers"
        products={homepage.bestSellers}
      />
      <ProductRail
        eyebrow="Fresh arrivals"
        title="Newest products"
        products={homepage.newestProducts}
        compact
      />

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

      <section
        className="home-section two-column-section"
        aria-labelledby="testimonials-title"
      >
        <div>
          <span className="section-eyebrow">Testimonials</span>
          <h2 id="testimonials-title">Built around confidence</h2>
        </div>
        <div className="testimonial-list">
          {homepage.testimonials.map((testimonial) => (
            <blockquote key={testimonial.id}>
              <div
                aria-label={`${testimonial.rating.toString()} star rating`}
                className="rating-row"
              >
                {Array.from({ length: testimonial.rating }, (_, index) => (
                  <Star
                    aria-hidden="true"
                    fill="currentColor"
                    key={index}
                    size={16}
                  />
                ))}
              </div>
              <p>{testimonial.quote}</p>
              <footer>{testimonial.customerName}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="blogs-title">
        <SectionHeading
          eyebrow="Latest blogs"
          title="Guides for smarter shopping"
          action={{ href: "/blogs", label: "Read all" }}
        />
        <div className="blog-grid">
          {homepage.latestBlogs.map((blog) => (
            <article className="blog-card" key={blog.id}>
              <Clock3 aria-hidden="true" size={18} />
              <time dateTime={blog.publishedAt}>
                {formatDate(blog.publishedAt)}
              </time>
              <h3>{blog.title}</h3>
              <p>{blog.excerpt}</p>
              <a href={`/blogs/${blog.slug}`}>Read article</a>
            </article>
          ))}
        </div>
      </section>

      <section
        className="newsletter-section"
        aria-labelledby="newsletter-title"
      >
        <div>
          <Mail aria-hidden="true" size={22} />
          <h2 id="newsletter-title">Get the best of Midas Basket</h2>
          <p>
            Newsletter UI is ready for a secure backend subscription endpoint in
            a later phase.
          </p>
        </div>
        <form className="newsletter-form">
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <input
            id="newsletter-email"
            name="email"
            placeholder="you@example.com"
            type="email"
          />
          <Button tone="primary" type="submit">
            Subscribe
          </Button>
        </form>
      </section>

      <footer className="site-footer">
        <strong>Midas Basket</strong>
        <span>Fast, secure, premium ecommerce foundation.</span>
      </footer>
    </main>
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

function ProductRail({
  compact = false,
  eyebrow,
  products,
  title,
}: Readonly<{
  compact?: boolean;
  eyebrow: string;
  products: HomepageProduct[];
  title: string;
}>): ReactNode {
  return (
    <section
      className="home-section"
      aria-labelledby={`${title.toLowerCase().replaceAll(" ", "-")}-title`}
    >
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        action={{ href: "/products", label: "View products" }}
      />
      <div
        className={
          compact ? "product-grid product-grid-compact" : "product-grid"
        }
      >
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-media" aria-hidden="true">
              <PackageSearch size={28} />
            </div>
            <div className="product-content">
              {product.badge ? <Badge>{product.badge}</Badge> : null}
              <h3>
                <a href={`/products/${product.slug}`}>{product.name}</a>
              </h3>
              <span>{product.sku}</span>
              <div className="product-price-row">
                <strong>{formatPrice(product)}</strong>
                {product.compareAtPrice ? (
                  <del>{formatter.format(product.compareAtPrice)}</del>
                ) : null}
              </div>
              <small>
                {product.rating.toFixed(1)} rating · {product.reviewCount}{" "}
                reviews
              </small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatPrice(product: HomepageProduct | undefined): string {
  if (!product) {
    return "Coming soon";
  }

  return formatter.format(product.price);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
    new Date(value),
  );
}
