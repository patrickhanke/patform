# patform

**patform** (internally *patwork*) is a Turborepo monorepo that powers two related web applications for facility operations and content management. Both apps share types, UI components, and a common data layer, but target different users and workflows.

| App | Port | Purpose |
|-----|------|---------|
| [**patflow**](apps/patflow) | 3002 | Workforce & facility management |
| [**patstore**](apps/patstore) | 3001 | CMS & project administration |

The user interface is primarily in **German**; code and identifiers are in **English**.

---

## Applications

### patflow

Operations platform for teams managing properties, work, and time.

- **Properties** — sites/objects, staff assignment, documents
- **Tasks & tickets** — work orders and issue tracking
- **Services & tours** — recurring service plans
- **Time records** — working hours, absences, vacation, surcharges
- **Staff** — worker overview and assignments
- **Settings** — time rules, surcharges, holidays, users, project config

Local dev: [http://localhost:3002](http://localhost:3002)

See [apps/patflow/AGENTS.md](apps/patflow/AGENTS.md) for routes and architecture details.

### patstore

Content management system for websites, communications, and modular project data.

- **Website** — pages, components, content
- **Articles, events, media** — structured content modules
- **Forms** — form builder and submissions
- **Email** — templates, lists, campaigns (Lettermint)
- **Admin** — projects, modules, users, playground

Local dev: [http://localhost:3001](http://localhost:3001)

See [apps/patstore/AGENTS.md](apps/patstore/AGENTS.md) for routes and module system details.

---

## Tech stack

- **[Next.js 14](https://nextjs.org/)** (App Router) — both apps
- **[Turborepo](https://turbo.build/)** — monorepo build orchestration
- **[Sashido / Parse Server](https://www.sashido.io/)** — backend via GraphQL and REST
- **[Apollo Client](https://www.apollographql.com/)** — GraphQL data layer
- **[Chakra UI](https://chakra-ui.com/)** & shared **`@repo/ui`** components
- **[Firebase](https://firebase.google.com/)** — push notifications (patflow)
- **[Bytescale](https://www.bytescale.com/)** — file uploads (patstore)

Sensitive operations (e.g. master-key queries) run through Next.js edge routes so secrets never reach the browser.

---

## Repository structure

```
patform/
├── apps/
│   ├── patflow/          # Workforce app (routes only)
│   └── patstore/         # CMS app (routes only)
├── packages/
│   ├── types/            # @repo/types — shared TypeScript types
│   ├── modules/          # @repo/modules — feature UI & business logic
│   ├── provider/         # @repo/provider — hooks, contexts, data access
│   ├── ui/               # @repo/ui — reusable components
│   ├── styles/           # @repo/styles — global CSS
│   └── assets/           # @repo/assets — static assets
├── turbo.json
└── package.json
```

### Package boundaries

| Package | Role |
|---------|------|
| `@repo/types` | Domain types for patflow and patstore |
| `@repo/modules` | Page-level modules exported into app routes |
| `@repo/provider` | Apollo, Parse/Sashido hooks, app contexts |
| `@repo/ui` | Tables, sidebar, inputs, editors, etc. |
| `@repo/styles` | Shared layout and global styles |

App `page.tsx` files are thin wrappers that re-export from `@repo/modules`:

```tsx
export { TimeSettings as default } from "@repo/modules";
```

Feature logic belongs in `packages/modules`, not in app routes.

---

## Getting started

### Prerequisites

- **Node.js** ≥ 18
- **npm** 9.x (see `packageManager` in `package.json`)
- A root **`.env`** file with backend credentials (see below)

### Install & run

From the repository root:

```bash
npm install

# Run one app
npm run dev:patflow    # http://localhost:3002
npm run dev:patstore   # http://localhost:3001

# Lint & build
npm run lint
npm run build
```

Lint or build a single package:

```bash
npx turbo lint --filter=patflow
npx turbo build --filter=patstore
```

---

## Environment variables

Configuration is loaded from a **`.env`** file at the repo root (referenced in `turbo.json` as a global dependency).

| Group | Variables | Used for |
|-------|-----------|----------|
| Sashido / Parse | `SASHIDO_APP_ID`, `SASHIDO_API_URL`, `SASHIDO_GQL_URL`, `SASHIDO_REST_KEY`, `SASHIDO_MASTER_KEY`, … | Backend API & GraphQL |
| Auth | `SESSION_TOKEN` | Parse session cookie name |
| Firebase | `FIREBASE_*` | Push notifications (patflow) |
| Bytescale | `BYTESCALE_*` | File uploads (patstore) |

The full list is defined in [`turbo.json`](turbo.json) under `globalEnv`. Do not commit `.env` or expose `SASHIDO_MASTER_KEY` in client code.

For secure data access patterns, see [`packages/provider/src/general/data/README_SECURE_DATA_HANDLER.md`](packages/provider/src/general/data/README_SECURE_DATA_HANDLER.md).

---

## Architecture overview

```
Browser
   │
   ├── GraphQL ──► app/api/graphql/route.ts ──► Sashido GraphQL
   │
   └── Secure CRUD ──► app/api/data/route.ts ──► Sashido REST (session / master key server-side)
```

- **Reads** — `useFindData`, `useFindDataSecure` from `@repo/provider`
- **Writes** — `useDataHandlerSecure` via the edge data route
- **Auth** — Parse session token stored in cookies

Route groups:

- `(application)` — authenticated app shell (both apps)
- `(login)` — login and legal pages
- `(admin)` — platform admin (patstore only)

---

## Development conventions

- Put **types** in `packages/types`, not inline in components
- Put **feature UI** in `packages/modules/src/{patflow|patstore}/`
- Put **routes** in `apps/{app}/app/...` as thin re-exports
- Reuse existing data hooks; avoid calling Sashido REST directly from components
- Never use the master key in client-side code

More detail for contributors and AI agents: [AGENTS.md](AGENTS.md)

---

## License

Private repository — all rights reserved unless otherwise specified by the project owner.
