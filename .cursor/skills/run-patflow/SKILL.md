---
name: run-patflow
description: Start and verify the patflow dev server. Use when developing patflow features — properties, tasks, tickets, records, time settings, staff, or patflow-specific provider/modules changes.
---

# Run patflow

## Prerequisites

- `.env` at repo root with `SASHIDO_*` and `FIREBASE_*` vars (see `turbo.json` globalEnv)
- Node >= 18

## Start

From repo root:

```bash
npm install
npm run dev:patflow
```

App runs at **http://localhost:3002**

## Verify a change

1. Identify the route (see `apps/patflow/AGENTS.md` route → module table)
2. Log in if needed (requires valid Parse user with `has_access`)
3. Navigate to the affected page
4. For module changes, confirm the re-export in `apps/patflow/app/(application)/.../page.tsx` points to the correct `@repo/modules` export

## Common feature locations

| Area | Module path |
|------|-------------|
| Time settings | `packages/modules/src/patflow/Settings/TimeSettings/` |
| Records | `packages/modules/src/patflow/Record/` |
| Properties | `packages/modules/src/patflow/Properties/` |
| Tasks | `packages/modules/src/patflow/Tasks/` |
| Context/data | `packages/provider/src/patflow/` |
| Types | `packages/types/src/patflow/` |

## Lint

```bash
npx turbo lint --filter=patflow
npx turbo lint --filter=@repo/modules
```

## Troubleshooting

- **Blank after login**: check Firebase env vars (login waits for FCM token)
- **No data**: verify `SASHIDO_GQL_URL` and project selection in AppContext
- **401 on writes**: session cookie / `SESSION_TOKEN` env mismatch
