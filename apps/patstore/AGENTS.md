# patstore

CMS and content management platform. Dev server: **http://localhost:3001**

## Purpose

Manage website content, articles, events, emails, forms, media, users, and project/module configuration.

## Route → module mapping

App routes are thin wrappers. Feature code lives in `packages/modules/src/patstore/`.

| Route | Module export |
|-------|---------------|
| `/articles` | `ArticlesOverview` |
| `/entries` | News overview |
| `/events` | `EventOverview` |
| `/categories` | `CategoriesOverview` |
| `/people` | Persons |
| `/images` | `ImagesOverview` |
| `/downloads` | `DownloadsOverview` |
| `/forms` | `FormsOverview` |
| `/groups` | `GroupOverview` |
| `/users` | `UsersOverview` |
| `/calendar` | `CalendarOverview` |
| `/locations` | `LocationOverview` |
| `/videos` | Videos |
| `/website/*` | Website pages, components, content, settings |
| `/emails/*` | Email templates, lists, campaigns |
| `/settings/project` | `PatstoreProject` |
| `/settings/logs` | `LogOverview` |
| `/admin/*` | Admin: projects, playground, dashboard |

## App structure

```
apps/patstore/app/
  (application)/     # Main CMS layout + dynamic sidebar from project modules
  (admin)/           # Platform admin (projects, playground)
  (login)/           # Login, register, password reset
  api/
    data/route.ts         # Secure Parse CRUD (edge)
    graphql/route.ts      # GraphQL proxy
    password_reset/       # Password reset
    lettermint/messages/  # Email delivery status
```

## Context providers

`LayoutContext.tsx` wraps the app with:

- `ApolloAppProvider` → GraphQL
- `AppContextProvider` → project selection
- `PatstoreAppContextProvider` → module config, roles, dynamic navigation

Context: `packages/provider/src/patstore/context/PatstoreAppContext/`

## Module system

Projects define enabled modules in Parse. Module definitions and field schemas:

- `packages/modules/src/patstore/Admin/Project/constants/module_option_fields.ts`
- `packages/types/src/patstore/Module.d.ts`

Admin UI for configuring modules: `packages/modules/src/patstore/Admin/Project/content/AppModule/`

Each module maps to a Parse class (e.g. `Article`, `Event`, `Webpage`) with configurable fields.

## Key domains

### Website

`packages/modules/src/patstore/Website/` — pages, components, content editing.

### Email

`packages/modules/src/patstore/Email/` — templates, lists, campaigns, Lettermint integration.

### Admin

`packages/modules/src/patstore/Admin/` — project management, user admin, playground tools.

## Data access

Same pattern as patflow:

- **GraphQL reads**: `useFindData` from `@repo/provider`
- **Secure operations**: `useDataHandlerSecure` → `app/api/data/route.ts`
- Session cookie: `patstore_token` (or `SESSION_TOKEN` env)

## Auth

Login: `app/(login)/login/page.tsx` and `login/[project_path]/page.tsx`

Registration and password reset flows in `app/(login)/`.

## Testing changes

```bash
npm run dev:patstore
```

Verify in browser at affected route. Module-specific pages appear in the sidebar based on project configuration.
