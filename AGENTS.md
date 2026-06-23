# patform (patwork monorepo)

Turborepo monorepo with two Next.js 14 apps and shared packages. German UI copy is common.

## Apps

| App | Path | Dev port | Purpose |
|-----|------|----------|---------|
| **patflow** | `apps/patflow` | 3002 | Workforce management: properties, tasks, tickets, time records, staff |
| **patstore** | `apps/patstore` | 3001 | CMS/admin: articles, website, emails, forms, media, project modules |

See `apps/patflow/AGENTS.md` and `apps/patstore/AGENTS.md` for app-specific details.

## Shared packages

| Package | Import | Role |
|---------|--------|------|
| `@repo/types` | types only | Domain types for patflow and patstore |
| `@repo/modules` | feature UI | Page-level modules exported to app routes |
| `@repo/provider` | hooks, contexts, data | Apollo, Parse/Sashido data layer, app contexts |
| `@repo/ui` | components | Shared UI primitives (Table, Sidebar, inputs) |
| `@repo/styles` | CSS | Global and layout styles |
| `@repo/assets` | assets | Shared static assets (patstore) |

## Commands

From repo root (requires `.env` at root):

```bash
npm install
npm run dev:patflow    # http://localhost:3002
npm run dev:patstore   # http://localhost:3001
npm run lint
npm run build
```

Filter to one package: `npx turbo lint --filter=patflow`

## Architecture

- **Next.js App Router** — route groups: `(application)`, `(login)`, `(admin)` (patstore only)
- **Backend**: Sashido (Parse Server) via GraphQL (`SASHIDO_GQL_URL`) and REST (`SASHIDO_API_URL`)
- **Secure data**: Edge Functions at `app/api/data/route.ts` — master key never in browser
- **Auth**: Parse session token in cookies (`SESSION_TOKEN` env, default `patstore_token` for patstore)
- **Firebase**: push notifications (patflow login)
- **Bytescale**: file uploads (patstore modules)

## Where to put changes

| Change type | Location |
|-------------|----------|
| New page route (thin wrapper) | `apps/{app}/app/(application)/.../page.tsx` |
| Feature UI and business logic | `packages/modules/src/{patflow\|patstore}/...` |
| Shared types | `packages/types/src/{patflow\|patstore}/...` |
| Data hooks / context | `packages/provider/src/{patflow\|patstore}/...` |
| Reusable UI | `packages/ui/src/...` |

App `page.tsx` files typically re-export from `@repo/modules`:

```tsx
export { TimeSettings as default } from "@repo/modules";
```

## Conventions

- Minimize scope — change only what the task requires
- Types live in `@repo/types`, not inline in components
- Use existing hooks (`useFindData`, `useFindDataSecure`, `useDataHandlerSecure`) from `@repo/provider`
- Match surrounding naming, imports, and folder structure
- UI language is German; code and identifiers are English

## Environment

Required vars are listed in `turbo.json` `globalEnv`. Key groups:

- `SASHIDO_*` — Parse backend
- `FIREBASE_*` — Firebase (patflow)
- `BYTESCALE_*` — file uploads
- `SESSION_TOKEN` — cookie name for auth

## Cursor Cloud

When running as a Cloud Agent:

1. Run `npm install` (see `.cursor/environment.json`)
2. Ensure secrets are configured in the Cursor dashboard (prefix per app if needed: `PATFLOW_*`, `PATSTORE_*`)
3. Start the relevant app: `npm run dev:patflow` or `npm run dev:patstore`
4. Smoke-test via login page; full flows require valid Sashido credentials
