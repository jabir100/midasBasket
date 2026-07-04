# Changelog

All notable changes to Midas Basket will be documented in this file.

## 2026-07-05

### Added

- Completed Phase 7 cart and wishlist foundations with backend schemas, validation, and APIs for guest/customer cart operations plus persistent customer wishlist.
- Added optional access-token middleware to support mixed authenticated and guest cart behavior.
- Added frontend cart and wishlist API adapters, pages, and routes (`/cart`, `/wishlist`) with catalog card actions and header navigation wiring.
- Completed Phase 8 checkout and orders foundations with COD checkout flow, order creation from cart snapshots, stock decrement, and order status timeline persistence.
- Added backend order history and tracking APIs (`/orders/me`, `/orders/me/:id`, `/orders/track/:orderNumber`).
- Added frontend checkout and orders pages/routes (`/checkout`, `/orders`) with customer order listing and timeline-based tracking UI.
- Added Phase 7 and Phase 8 handoff summaries under `docs/handoffs/phase-07-cart-wishlist.md` and `docs/handoffs/phase-08-checkout-orders.md`.

## 2026-07-04

### Added

- Created living architecture documentation for the ecommerce platform.
- Created task tracker with required development phases and approval gate.
- Created decision log with initial deployment, caching, and RBAC decisions.
- Created initial repository skeleton for frontend, backend, shared packages, docs, and scripts.
- Started Phase 2 backend foundation with pnpm workspace metadata, strict TypeScript configuration, shared API contracts, Express app skeleton, environment validation, security middleware, logging, database/cache modules, and authentication primitives.
- Superseded the root workspace/shared-package approach and moved backend contracts plus tooling into `apps/backend` for separate frontend/backend deployments.
- Completed backend-local dependency installation and validation with lint, typecheck, and build.
- Started Phase 3 frontend foundation with a separate TanStack Start app, local package metadata, strict TypeScript, TanStack Query provider, Tailwind CSS v4 brand theme, base app shell, and environment-aware API client.
- Removed the frontend Motion dependency and documented CSS-only micro-interactions as the default performance approach.
- Removed HeroUI from the automated frontend install path after registry timeouts and added local temporary UI primitives.
- Added a HeroUI specialist custom agent at `.github/agents/hero-ui.agent.md` for future manual HeroUI integration.
- Completed frontend-local dependency installation and validation with build, lint, and typecheck.
- Added Phase 1, Phase 2, and Phase 3 handoff summaries under `docs/handoffs`.
- Started Phase 4 with a homepage architecture draft and static-first implementation decision.
- Added the initial typed homepage payload contract and preview data for Phase 4 frontend section work.
- Implemented the static-first homepage section composition with SEO metadata and responsive styling.
- Added the homepage Redis cache contract and Phase 4 handoff summary.
- Approved the Phase 4 gate and started Phase 5 authentication plus Phase 6 catalog work in the task tracker.
- Completed Phase 5 authentication with persisted users, refresh sessions, password reset tokens, protected auth routes, and frontend auth/account pages.
- Completed Phase 6 catalog foundations with category, brand, and product schemas, admin/public catalog APIs, homepage cache invalidation hooks, and frontend catalog pages.
