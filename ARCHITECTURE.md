# Midas Basket Architecture

## Purpose

Midas Basket is a production ecommerce platform designed for high performance, strong security, SEO, and long-term maintainability. Do not use any kind of un necessary, silly animation like fade up , pop up those make the site slow. if needed use micro animation with vanilla css and built in server side. This document is living architecture: every meaningful technical decision must either update this file or be recorded in `DECISIONS.md`.

## Phase 1 Scope

Phase 1 establishes requirements, architecture, technical decisions, and the repository structure. It intentionally does not implement product features, authentication, checkout, admin workflows, or UI screens before approval.

## Goals

- Fast, mobile-first storefront with server rendering and cache-friendly delivery.
- Secure backend with strict validation, hardened HTTP defaults, auditable admin actions, and no reliance on frontend authorization.
- SEO-ready public pages with dynamic metadata, semantic HTML, JSON-LD, sitemap support, and image optimization.
- Maintainable feature-based code organization for a growing ecommerce team.
- Non-technical admin experience planned around clear management modules and reusable UI patterns.

## Repository Layout

```text
apps/
  frontend/      TanStack Start storefront, customer area, and admin UI shell with its own package.json and node_modules
  backend/       Express API, authentication, business logic, workers, integrations with its own package.json and node_modules
docs/            Product, API, deployment, admin, and developer documentation
scripts/         Operational scripts used by development and CI
```

Frontend and backend are independent deployable applications. Each app owns its dependencies, package lockfile, TypeScript configuration, linting configuration, and local `node_modules`. The repository root is reserved for documentation, shared process files, and non-package project governance.

Feature code should be organized by domain rather than technical layer wherever practical. Cross-app contracts should be duplicated deliberately or generated from API documentation until there is an approved reason to reintroduce a shared package.

## Frontend Architecture

- Framework: TanStack Start with React 19, TypeScript strict mode, TanStack Router, and TanStack Query.
- UI: HeroUI as the primary component library, Tailwind CSS v4 for styling, Lucide React for icons, and CSS-only micro-interactions where they improve usability.
- Forms: React Hook Form with Zod validation.
- Data access: Axios client configured for versioned API calls, request IDs, auth refresh behavior, and typed response envelopes.
- Rendering: SSR and static generation for public pages where possible; route splitting and lazy loading for non-critical surfaces.
- Homepage: generated from cacheable data, served quickly, and invalidated only when products, categories, brands, banners, blogs, or homepage settings change.

Planned frontend feature areas:

```text
apps/frontend/src/features/
  home/
  catalog/
  product/
  search/
  cart/
  checkout/
  auth/
  customer/
  admin/
  seo/
```

## Backend Architecture

- Runtime: Node.js with Express.js and TypeScript strict mode.
- API style: REST under `/api/v1` with backend-owned standard success, error, validation, pagination, filtering, sorting, and search formats.
- Database: MongoDB Atlas with Mongoose models, indexes, and schema-level validation.
- Cache: Redis for homepage, settings, categories, and featured catalog data.
- Storage: Cloudinary for images with Sharp preprocessing before upload.
- Logging: Pino structured logs, request IDs, Morgan-compatible HTTP logging if needed, and audit logs for admin activity.

Planned backend feature areas:

```text
apps/backend/src/features/
  auth/
  users/
  admins/
  products/
  categories/
  brands/
  orders/
  reviews/
  wishlist/
  cart/
  addresses/
  coupons/
  homepage/
  banners/
  blogs/
  notifications/
  audit-logs/
  seo/
```

Shared backend infrastructure should live outside feature folders only when it is genuinely cross-cutting, such as configuration, database connection, logging, middleware, security, and error handling.

## Security Architecture

Security is a primary design constraint.

- Password hashing: Argon2.
- Authentication: short-lived JWT access tokens plus rotating refresh tokens stored in HTTP-only cookies.
- Cookies: `HttpOnly`, `Secure`, `SameSite`, scoped paths, and production-only domain configuration.
- Authorization: backend RBAC middleware. Admin and Customer roles are enforced server-side for every protected route.
- Validation: Zod request validation at API boundaries. Client validation is only UX support.
- HTTP hardening: Helmet, strict CSP, HSTS, CORS whitelist, rate limiting, slow-down middleware, compression, and secure headers.
- Upload safety: MIME validation, image validation, file size limits, Sharp preprocessing, Cloudinary upload constraints, and deletion of replaced assets.
- Data protection: MongoDB injection protection, no stack traces in production responses, secret validation, request IDs, structured error logs, and audit trails.

## Data Architecture

Initial MongoDB collections:

- Users
- Admins
- Products
- Categories
- Brands
- Orders
- Reviews
- Wishlist
- Cart
- Addresses
- Coupons
- Homepage Settings
- Banners
- Blogs
- Notifications
- Audit Logs

Required index families:

- Identity: `email`, `phone`
- Catalog: `slug`, `sku`, `brand`, `category`
- Sorting and freshness: `createdAt`, `updatedAt`
- Operational: order status, customer ownership, and audit timestamps as features are implemented

Order documents must maintain a status timeline containing status, updated by, timestamp, and optional note.

## Caching And Invalidation

Redis should cache homepage and high-read public catalog fragments. Cache invalidation must be event-based from admin mutations, not time-only.

Homepage cache invalidation triggers:

- Product added, updated, or deleted
- Category updated
- Brand updated
- Banner updated
- Blog or homepage settings updated

The homepage should not regenerate on every request.

## Deployment Architecture

- Frontend: Vercel with production deployments from `main` and preview deployments for pull requests.
- Backend: separate Node service is the default recommendation for Express because it gives better control over long-lived database connections, middleware behavior, logging, rate limiting, and future worker workloads. Vercel Serverless Functions remain an option if later constraints prove suitable.
- Database: MongoDB Atlas.
- Redis: Upstash Redis.
- Images: Cloudinary.
- CI/CD: GitHub Actions running frontend and backend lint, type check, build, and tests from their respective app directories before merge.

## Quality Bar

- TypeScript strict mode everywhere.
- No JavaScript source files for application code.
- No `any`; prefer `unknown`, generics, and reusable shared types.
- Feature-based organization.
- Small functions, clear boundaries, centralized error handling, and reusable UI components.
- Tests scale with risk: unit, integration, and API tests for critical behavior.

## Open Questions

- Payment provider for future online payment support.
- Exact admin permission granularity beyond Admin and Customer.
- Whether blog content will be managed entirely in the admin dashboard or integrated with a content workflow.
- Whether search should remain database-backed initially or move to a dedicated search engine when catalog size requires it.
