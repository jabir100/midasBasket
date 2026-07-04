# Midas Basket Tasks

This file tracks phase progress and must be updated as work proceeds. Phases must not be skipped. Approval is required before moving to the next phase.

## Current Phase

Phase 9 and Phase 10: Customer Dashboard, Admin Dashboard

Status: Awaiting approval

## Phase Plan

| Phase | Name                                                                 | Status            | Exit Criteria                                                                                   |
| ----- | -------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------- |
| 1     | Requirement Analysis, Architecture, Tech Decisions, Folder Structure | Completed         | Living docs created, decisions recorded, folder skeleton ready, approval requested              |
| 2     | Backend Foundation, Database, Authentication, Security               | Completed         | Express app, config validation, database connection, security middleware, auth foundation       |
| 3     | Frontend Foundation, Theme, Layouts, Design System, Routing          | Completed         | TanStack Start app, theme, reusable UI primitives, base routing                                 |
| 4     | Homepage                                                             | Completed         | SSR/static homepage, Redis-backed data strategy, sections implemented, cache invalidation paths |
| 5     | Authentication                                                       | Completed         | Register, login, logout, refresh rotation, forgot/reset password, session management            |
| 6     | Products, Categories, Brands                                         | Completed         | Catalog CRUD, public listing/detail pages, filters, images, SEO fields                          |
| 7     | Cart, Wishlist                                                       | Completed         | Guest and customer carts, persistent wishlist, coupon readiness                                 |
| 8     | Checkout, Orders                                                     | Completed         | Single-page checkout, COD, order creation, status timeline, tracking                            |
| 9     | Customer Dashboard                                                   | Completed         | Profile, orders, invoices, addresses, wishlist, notifications                                   |
| 10    | Admin Dashboard                                                      | Completed         | Management modules, analytics, audit logs, responsive admin UI                                  |
| 11    | SEO, Performance, Optimization                                       | Not started       | Metadata, sitemap, JSON-LD, Core Web Vitals, compression, caching review                        |
| 12    | Testing, Deployment, Documentation                                   | Not started       | Tests, GitHub Actions, deployment guide, admin guide, developer guide                           |

## Phase 1 Tasks

- [x] Capture architecture goals and constraints.
- [x] Record initial architectural decisions.
- [x] Define repository structure.
- [x] Validate created files and folder skeleton.
- [x] Request approval before Phase 2.

## Phase 2 Tasks

- [x] Remove root workspace and shared packages per updated deployment requirement.
- [x] Create backend-owned strict TypeScript and lint configuration.
- [x] Create backend-owned API response and auth contracts.
- [x] Create Express backend application skeleton.
- [x] Add environment validation and `.env.example`.
- [x] Add request IDs, structured logging, centralized responses, and error handling.
- [x] Add security middleware foundation: Helmet, CSP, HSTS, CORS whitelist, rate limiting, slow down, and MongoDB sanitization.
- [x] Add MongoDB and Redis connection modules.
- [x] Add auth primitives for Argon2 password hashing, JWT access tokens, refresh tokens, secure refresh cookie settings, and RBAC middleware.
- [x] Install backend dependencies locally inside `apps/backend`.
- [x] Validate backend lint, type checking, and build.
- [x] Review Phase 2 work and request approval before Phase 3.

## Phase 3 Tasks

- [x] Create frontend-owned package metadata and local tool configuration.
- [x] Add TanStack Start routing foundation.
- [x] Add TanStack Query provider and local UI primitives while HeroUI install is deferred.
- [x] Add Tailwind CSS v4 brand theme foundation.
- [x] Add reusable app shell and initial UI primitives.
- [x] Add frontend environment validation and Axios API client.
- [x] Install frontend dependencies locally inside `apps/frontend` without HeroUI.
- [x] Validate frontend lint, type checking, and build.
- [x] Review Phase 3 work and request approval before Phase 4.

## Phase 4 Tasks

- [x] Create homepage architecture draft and implementation sequence.
- [x] Define typed homepage section data contract.
- [x] Implement homepage section composition in the frontend.
- [x] Add SEO metadata and semantic heading structure.
- [x] Define Redis homepage cache key and invalidation contract.
- [x] Validate frontend build, lint, typecheck, and responsive rendering.
- [x] Generate Phase 4 handoff summary and request approval before Phase 5.

## Phase 5 Tasks

- [x] Define backend user identity model, refresh token persistence, and password reset token lifecycle.
- [x] Implement register, login, logout, refresh, forgot password, and reset password API routes.
- [x] Enforce access-token auth and refresh-token rotation with HTTP-only cookies.
- [x] Add customer session retrieval and backend-protected route middleware coverage.
- [x] Create frontend auth forms, session provider, protected route UX, and API integration.
- [x] Add focused validation for auth services, routes, and frontend flows.
- [x] Generate Phase 5 handoff summary and request approval before Phase 7.

## Phase 6 Tasks

- [x] Define category, brand, and product MongoDB schemas with slugs, SEO fields, indexes, and image metadata.
- [x] Implement admin CRUD APIs for categories, brands, and products with backend RBAC.
- [x] Implement public catalog listing, filtering, sorting, search, and product detail APIs.
- [x] Add homepage/cache invalidation hooks for product, category, and brand mutations.
- [x] Create frontend catalog listing, product detail, category, and brand browsing surfaces.
- [x] Add focused validation for catalog models, APIs, cache invalidation, and frontend rendering.
- [x] Generate Phase 6 handoff summary and request approval before Phase 7.

## Phase 7 Tasks

- [x] Define cart persistence model for guest and authenticated customer ownership.
- [x] Implement cart APIs for item add/update/remove, cart retrieval, clear, and coupon readiness.
- [x] Define and implement persistent wishlist APIs for authenticated customers.
- [x] Add frontend cart and wishlist API clients with guest cart identity handling.
- [x] Create frontend cart and wishlist pages/routes and wire primary navigation/actions.
- [x] Validate backend and frontend build/typecheck for cart and wishlist implementation.
- [x] Generate Phase 7 handoff summary and proceed to Phase 8 implementation.

## Phase 8 Tasks

- [x] Define order schema with status timeline and COD payment metadata.
- [x] Implement checkout API to create orders from cart state and clear cart on success.
- [x] Implement customer order history/detail APIs and tracking endpoint.
- [x] Create frontend single-page checkout flow with COD order submission.
- [x] Create frontend orders/tracking page with status timeline rendering.
- [x] Validate backend and frontend build/typecheck for checkout and orders implementation.
- [x] Generate Phase 8 handoff summary and request approval before Phase 9.

## Phase 9 Tasks

- [x] Implement backend customer profile APIs for dashboard summary and profile updates.
- [x] Implement backend customer address book APIs (list, create, update, delete).
- [x] Implement backend customer notification preferences APIs.
- [x] Implement backend customer invoice listing from order history.
- [x] Create frontend customer dashboard route and UI for profile, addresses, invoices, and preferences.
- [x] Wire customer dashboard navigation and account shortcuts.
- [x] Validate backend and frontend build/typecheck for customer dashboard implementation.
- [x] Generate Phase 9 handoff summary and request approval for Phase 9 closure.

## Phase 10 Tasks

- [x] Implement backend admin dashboard analytics summary API.
- [x] Implement backend admin user management APIs.
- [x] Implement backend admin order lifecycle status update API with transition guardrails.
- [x] Implement backend audit log model and admin audit log listing API.
- [x] Create frontend admin dashboard route and responsive UI for analytics, user management, order management, and audit feed.
- [x] Validate backend and frontend build/typecheck for admin dashboard implementation.
- [x] Generate Phase 10 handoff summary and request approval before Phase 11.

## Backlog

- Define standard REST response envelope.
- Define environment variable schema for frontend and backend.
- Define MongoDB model conventions and indexing strategy.
- Define audit log event taxonomy.
- Define image upload lifecycle and deletion policy.
- Define homepage cache key strategy.
- Define SEO metadata builder contract.
- Define admin dashboard navigation and permission model.
- Define checkout validation and order status transition rules.
