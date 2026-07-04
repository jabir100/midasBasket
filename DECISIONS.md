# Midas Basket Decision Log

This file records durable architectural decisions. New decisions must include context, decision, trade-offs, and consequences.

## 2026-07-04: Use A Root Workspace With Shared Packages

Status: Superseded by `2026-07-04: Use Separate Frontend And Backend App Packages`

Context: The platform was initially expected to benefit from root-level workspace tooling and imported cross-app contracts.

Decision: This approach is no longer current.

Trade-offs: It could reduce duplication, but it conflicts with the updated requirement that frontend and backend own dependencies separately for independent deployment.

Consequences: Do not create a root workspace package layer. Do not add shared app packages without explicit approval.

## 2026-07-04: Use Separate Frontend And Backend App Packages

Status: Accepted

Context: The project will deploy frontend and backend separately. The client requested no root `packages` folder and no shared package layer. Frontend dependencies and `node_modules` must live inside the frontend app; backend dependencies and `node_modules` must live inside the backend app.

Decision: Remove the root package workspace and `packages` folder. Keep `apps/frontend` and `apps/backend` as independent deployable applications, each with its own package metadata, TypeScript configuration, linting configuration, lockfile, and dependency installation.

Trade-offs: This avoids cross-app package coupling and mirrors separate deployments more directly. The downside is that shared contracts may be duplicated or generated later instead of imported from a single package.

Consequences: Backend API response and auth types are backend-owned for now. Frontend API types should be generated from documented API contracts or defined locally when Phase 3 begins. Reintroducing shared packages requires explicit approval and a new decision.

## 2026-07-04: Keep Frontend And Backend Separate

Status: Accepted

Context: The requested stack uses TanStack Start for the frontend and Express for the backend. Security, audit logging, rate limiting, and future operational workflows are major requirements.

Decision: Maintain separate frontend and backend apps. The frontend consumes a versioned REST API from the backend.

Trade-offs: Separate apps add deployment and local development coordination, but they create clearer security boundaries and make backend scaling more predictable.

Consequences: Authentication, authorization, validation, and business rules live on the backend. The frontend never becomes the source of truth for permissions.

## 2026-07-04: Prefer Separate Node Backend Service Initially

Status: Accepted

Context: Express can run in serverless environments, but ecommerce security middleware, Redis caching, database connection management, structured logging, and future workers are easier to reason about in a dedicated Node service.

Decision: Treat a separate Node backend service as the default deployment architecture. Keep the code portable enough to revisit serverless later if constraints are favorable.

Trade-offs: A separate service may require additional hosting configuration compared with Vercel-only deployment, but it reduces risk around runtime limitations and connection behavior.

Consequences: Deployment docs must describe frontend and backend environments separately. CI must build and test both apps.

## 2026-07-04: Use Redis Event-Based Cache Invalidation For Homepage

Status: Accepted

Context: The homepage is the highest-priority performance surface and must not regenerate on every request. It changes when admins mutate products, categories, brands, banners, blogs, or homepage settings.

Decision: Cache homepage data in Redis and invalidate the relevant keys from admin mutation paths.

Trade-offs: Event-based invalidation requires careful mutation discipline, but it avoids stale content windows from time-only caching and avoids expensive regeneration per request.

Consequences: Admin product, category, brand, banner, blog, and homepage settings modules must publish cache invalidation events as part of successful writes.

## 2026-07-04: Backend-Enforced Simple RBAC

Status: Accepted

Context: The requested role model is intentionally simple: Admin and Customer. Security is a major client concern.

Decision: Use backend-enforced RBAC middleware for protected routes. Admins have access to admin modules; customers can access only their own account, orders, wishlist, cart, addresses, and profile.

Trade-offs: Simple RBAC is easier to audit and maintain than granular permissions early, but the admin panel may eventually need more detailed permission scopes.

Consequences: Do not implement frontend-only route protection as the primary security mechanism. Future granular permissions must extend this model without weakening backend enforcement.

## 2026-07-04: Approve Backend Dependency Build Scripts Explicitly

Status: Accepted

Context: pnpm blocks dependency build scripts unless explicitly approved. The backend requires Argon2 for password hashing and tsx uses esbuild for development tooling.

Decision: Approve only `argon2` and `esbuild` in the backend-local pnpm build policy.

Trade-offs: Explicit approval adds a maintenance step when adding native dependencies, but it reduces supply-chain risk by avoiding blanket script execution.

Consequences: The backend app owns this policy in `apps/backend/pnpm-workspace.yaml`. New dependencies that require build scripts must be reviewed and documented before approval.

## 2026-07-05: Frontend Owns Its Dependencies And UI Foundation

Status: Accepted

Context: The frontend deploys separately from the backend and must not rely on root workspace packages. Phase 3 establishes the frontend foundation before the homepage is implemented.

Decision: Create `apps/frontend` as an independent TanStack Start application with local package metadata, local dependency installation, strict TypeScript, app-local linting, TanStack Query providers, Tailwind CSS v4 brand tokens, and feature-based source folders.

Trade-offs: Frontend and backend contracts are not imported from a shared package, so API types must be generated or duplicated deliberately when features are built. The benefit is clearer deployment boundaries and app-local dependency ownership.

Consequences: Frontend dependencies and `node_modules` remain inside `apps/frontend`. Homepage implementation waits for Phase 4 and should use this shell rather than replacing it.

## 2026-07-05: Avoid JavaScript Animation Dependencies By Default

Status: Accepted

Context: The storefront must be extremely fast. The architecture now explicitly rejects unnecessary fade-up, pop-up, and decorative animation patterns that slow down the experience.

Decision: Do not include Motion or similar JavaScript animation libraries in the frontend foundation. Use CSS-only micro-interactions sparingly when they improve feedback or usability.

Trade-offs: This reduces animation convenience and some advanced choreography options, but it keeps the default bundle lighter and aligns the design system with performance goals.

Consequences: Future animation libraries require explicit approval and a documented performance reason. Phase 4 homepage work should avoid decorative motion and prioritize layout stability, speed, and Core Web Vitals.

## 2026-07-05: Defer HeroUI Wiring Until Manual Setup Completes

Status: Accepted

Context: Installing HeroUI packages from the automated terminal repeatedly timed out while fetching React Aria and React Spectrum transitive metadata. The user then installed `@heroui/react` and `@heroui/styles` manually inside `apps/frontend`.

Decision: Keep Phase 3 source code on local temporary UI primitives until HeroUI integration is planned deliberately. HeroUI packages may remain installed in `apps/frontend`; component replacement should be incremental.

Trade-offs: The temporary primitives are not the final design system implementation, but they unblock TanStack Start, TypeScript, routing, and layout validation while avoiding install failures.

Consequences: Replace the temporary primitives incrementally and prefer measured component integration. Watch CSS and JS bundle size when importing HeroUI styles or components.

## 2026-07-05: Build Homepage In Static-First Layers

Status: Accepted

Context: Phase 4 requires a high-performance homepage, but backend product, banner, brand, blog, and homepage settings modules are not implemented yet.

Decision: Start Phase 4 with a static-first frontend homepage section composition and a documented backend cache contract. Replace static data with `/api/v1/homepage` once backend homepage data endpoints exist.

Trade-offs: This creates a temporary local data layer, but it lets layout, SEO structure, responsiveness, and performance work progress without blocking on later catalog/admin modules.

Consequences: Static homepage data must stay isolated and typed so it can be replaced by API data without rewriting section components.
