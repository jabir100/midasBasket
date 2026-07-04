import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const siteUrl = (
  process.env.VITE_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

const publicRoutes = ["/", "/products", "/categories", "/brands"];
const lastModified = new Date().toISOString().slice(0, 10);

const sitemapEntries = publicRoutes
  .map((route) => {
    const url = route === "/" ? siteUrl : `${siteUrl}${route}`;
    return [
      "  <url>",
      `    <loc>${url}</loc>`,
      `    <lastmod>${lastModified}</lastmod>`,
      "    <changefreq>daily</changefreq>",
      "    <priority>0.8</priority>",
      "  </url>",
    ].join("\n");
  })
  .join("\n");

const sitemapXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  sitemapEntries,
  "</urlset>",
  "",
].join("\n");

const robotsTxt = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /admin",
  "Disallow: /account",
  "Disallow: /dashboard",
  "Disallow: /checkout",
  "Disallow: /cart",
  "Disallow: /wishlist",
  "Disallow: /orders",
  "Disallow: /login",
  "Disallow: /register",
  "Disallow: /forgot-password",
  "Disallow: /reset-password",
  "",
  `Sitemap: ${siteUrl}/sitemap.xml`,
  "",
].join("\n");

const publicDirectory = join(process.cwd(), "public");
mkdirSync(publicDirectory, { recursive: true });
writeFileSync(join(publicDirectory, "sitemap.xml"), sitemapXml, "utf8");
writeFileSync(join(publicDirectory, "robots.txt"), robotsTxt, "utf8");
