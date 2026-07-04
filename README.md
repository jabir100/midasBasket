# Midas Basket

Midas Basket is a modern ecommerce platform planned around performance, security, SEO, maintainability, and a premium mobile-first user experience.

## Current Status

Phase 1 is in progress: requirement analysis, architecture, technical decisions, and folder structure.

No application code has been implemented yet. The next phase requires approval before backend foundation work begins.

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
- Backend: Node.js, Express.js, TypeScript, MongoDB, Mongoose, Redis.
- Storage and images: Cloudinary and Sharp.
- Authentication: JWT access token, refresh token rotation, HTTP-only cookies, Argon2 password hashing.
- Tooling: pnpm, ESLint, Prettier, Husky, lint-staged, Commitlint, GitHub Actions.

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
corepack pnpm build
```
