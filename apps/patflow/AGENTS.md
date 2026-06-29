# patflow

Workforce and facility management app. Dev server: **http://localhost:3002**

## Purpose

Manage properties (Objekte), tasks, tickets, services/tours, time records (Zeiterfassung), staff, and project settings.

## Route → module mapping

App routes are thin wrappers. Feature code lives in `packages/modules/src/patflow/`.

| Route | Module export |
|-------|---------------|
| `/` | Dashboard (in `apps/patflow/app/(application)/content/Dashboard`) |
| `/properties` | `PropertyOverview` |
| `/tasks/*` | `Tasks` |
| `/tickets/*` | `Tickets` |
| `/services/*`, `/services/tours` | Services, `ToursOverview` |
| `/records` | `Records` |
| `/staff` | `StaffOverview` |
| `/settings/times` | `TimeSettings` |
| `/settings/user_management` | `UserManagement` |
| `/settings/project` | `PatflowProject` |
| `/settings/services` | `ServiceTemplatesOverview` |
| `/settings/logs` | `LogOverview` |

## App structure

```
apps/patflow/app/
  (application)/     # Authenticated layout + sidebar
  (login)/           # Login, impressum, datenschutz
  api/
    data/route.ts    # Secure Parse CRUD (edge)
    graphql/route.ts # GraphQL proxy
```

## Context providers

`LayoutContext.tsx` wraps the app with:

- `ApolloAppProvider` → GraphQL
- `AppContextProvider` → project selection
- `PatflowAppContextProvider` → patflow-specific data store (records, workers, properties, surcharges, holidays)
- `NotificationContextProvider` → Firebase push

Data store and subscriptions: `packages/provider/src/patflow/context/PatflowAppContext/`

## Key domains

### Time settings (`/settings/times`)

Module: `packages/modules/src/patflow/Settings/TimeSettings/`

- **EditRecords** — record templates (work time types)
- **SurchargeSettings** — surcharge rules
- **Holidays** — public holidays

Types: `packages/types/src/patflow/content/Record/`

When adding record fields, follow the **patflow-time-settings** skill (`.cursor/skills/patflow-time-settings/SKILL.md`): types → `defaultRecord.ts` → CreateRecord/RecordTimes/EditRecord → table columns → query fields.

### Records (`/records`)

Module: `packages/modules/src/patflow/Record/`

Staff time tracking, absences, vacation, print/export.

### Properties, tasks, tickets

- Properties: `packages/modules/src/patflow/Properties/`
- Tasks: `packages/modules/src/patflow/Tasks/`
- Tickets: `packages/modules/src/patflow/Tickets/`

## Data access

- **GraphQL reads**: `useFindData`, `useFindDataSecure` from `@repo/provider`
- **Secure writes/reads**: `useDataHandlerSecure` → `app/api/data/route.ts`
- **Master key**: only via `useMasterKey: true` in secure hooks (server-side)

See `packages/provider/src/general/data/README_SECURE_DATA_HANDLER.md`

## Auth

Login: `app/(login)/content/LoginForm/components/PatflowLoginForm.tsx`

Uses Firebase messaging token + Parse login. Checks `has_access` before allowing login.

## Testing changes

```bash
npm run dev:patflow
```

Verify in browser at affected route. For TimeSettings, go to **Einstellungen → Zeiten und Zuschläge**.
