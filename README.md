# Midas Basket

Midas Basket is a modern ecommerce platform planned around performance, security, SEO, maintainability, and a premium mobile-first user experience.

## Current Status

Phase 12 is completed: testing, deployment, and documentation.

The platform now includes backend, frontend, SEO, checkout, dashboard, admin, test, and CI foundations. Phase progress is tracked in `TASKS.md`.

## Architecture Documents

- `ARCHITECTURE.md` defines the living system architecture.
- `DECISIONS.md` records durable technical decisions and trade-offs.
- `TASKS.md` tracks phase progress and approval gates.
- `CHANGELOG.md` records project changes.

## Planned Stack

- Frontend: TanStack Start, React 19, TypeScript, TanStack Router, TanStack Query, Tailwind CSS v4, React Hook Form, Zod, Lucide React, Axios, and HeroUI installed inside `apps/frontend`.

## Phase Handoffs

- `docs/handoffs/phase-01-requirements-architecture.md`
- `docs/handoffs/phase-02-backend-foundation.md`
- `docs/handoffs/phase-03-frontend-foundation.md`

## Backend Stack

- Node.js, Express.js, TypeScript, MongoDB, Mongoose, Redis.
- JWT access tokens, refresh token rotation, HTTP-only cookies, Argon2 password hashing.
- Helmet, CORS allowlists, rate limiting, request IDs, structured logs, and audit logs.

## Tooling

- pnpm, ESLint, Prettier, TypeScript, Vitest, Supertest, GitHub Actions.

## Repository Layout

```text
apps/
  frontend/
  backend/
docs/
scripts/
```

Frontend and backend are independent deployable applications. Each app owns its own dependencies, lockfile, configuration, and local `node_modules`.

## Backend Development

```bash
cd apps/backend
corepack pnpm install
corepack pnpm dev
```

Backend validation:

```bash
cd apps/backend
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
```

## Frontend Development

```bash
cd apps/frontend
corepack pnpm install
corepack pnpm dev
```

Frontend validation:

```bash
cd apps/frontend
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
```

## Documentation

- `docs/deployment-guide.md`
- `docs/admin-guide.md`
- `docs/developer-guide.md`
