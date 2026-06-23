---
name: run-patstore
description: Start and verify the patstore dev server. Use when developing patstore features — website, articles, emails, forms, media, admin modules, or patstore-specific provider/modules changes.
---

# Run patstore

## Prerequisites

- `.env` at repo root with `SASHIDO_*` vars (see `turbo.json` globalEnv)
- Node >= 18

## Start

From repo root:

```bash
npm install
npm run dev:patstore
```

App runs at **http://localhost:3001**

## Verify a change

1. Identify the route (see `apps/patstore/AGENTS.md` route → module table)
2. Log in (cookie: `patstore_token` or `SESSION_TOKEN` env value)
3. Select a project if sidebar is empty (requires active project in AppContext)
4. Navigate to the affected module page

## Common feature locations

| Area | Module path |
|------|-------------|
| Website | `packages/modules/src/patstore/Website/` |
| Email | `packages/modules/src/patstore/Email/` |
| Admin / modules | `packages/modules/src/patstore/Admin/` |
| Module field config | `packages/modules/src/patstore/Admin/Project/` |
| Context/data | `packages/provider/src/patstore/` |
| Types | `packages/types/src/patstore/` |

## Lint

```bash
npx turbo lint --filter=patstore
npx turbo lint --filter=@repo/modules
```

## Troubleshooting

- **Empty sidebar**: no project selected — AppContext needs an active project
- **Module not visible**: check project module config in Parse / `module_option_fields.ts`
- **Email issues**: check `NEXT_PUBLIC_LETTERMINT_API_KEY` and `app/api/lettermint/` routes
