---
name: patflow-time-settings
description: Add or change patflow Record fields, surcharges, and time settings. Use when working on TimeSettings, EditRecords, CreateRecord, RecordTimes, RecordSurcharges, EditRecord, useRecordsTableColumns, Record types, or Zeiten und Zuschläge at /settings/times.
---

# patflow TimeSettings & Record workflow

Route: `/settings/times` → module `TimeSettings` → tab **Zeiterfassung** (`records`)

## Module layout

```
packages/modules/src/patflow/Settings/TimeSettings/
  TimeSettings.tsx              # Page with 4 tabs (site_states)
  constants/site_states.ts      # surcharges | holiday-templates | holidays | records
  content/
    SurchargeSettings/          # Tab: Zuschläge
    HolidayTemplates/           # Tab: Feiertag-Templates
    Holidays/                   # Tab: Feiertage
    EditRecords/                # Tab: Zeiterfassung
      EditRecords.tsx           # Table + user select modal
      hooks/useRecordsTableColumns.tsx
      content/
        CreateRecord/
          CreateRecord.tsx      # SlideIn create flow
          constants/defaultRecord.ts
          components/RecordTimes.tsx      # time_settings form (secondary panel)
          components/RecordSurcharges.tsx # surcharge multi-select
          functions/getRemainingVacation.ts
        EditRecord/Editrecord.tsx         # Read-only detail SlideIn
```

## Parse classes involved

| Class | Purpose |
|-------|---------|
| `Record` | Yearly time record per worker |
| `Surcharge` | Overtime/holiday/work surcharge rules |
| `Holiday` | Named holiday with date arrays |
| `Template` | Holiday template (`type: "holiday"`) |
| `Day` | Daily time entries linked to a record |
| `Absence` | Vacation/sick leave linked to days |

## Record shape (key fields)

Types: `packages/types/src/patflow/content/Record/Record.d.ts`

```typescript
Record = {
  year, user, start_date, end_date,
  time_settings: { hours, weekdays, pause, vacation, start },
  default_times, absence, absence_days, saldo,
  holiday_template, former_record,
  surcharges: string[]   // Surcharge objectIds
}
```

Note: `defaultRecord.ts` also sets `initial_saldo` and `initial_vacation` — add these to the type if not yet present.

Surcharge type: `packages/types/src/patflow/General/Project.d.ts` → `Surcharge`

## Checklist: add a new Record field

Copy and track progress:

```
- [ ] 1. Type — packages/types/src/patflow/content/Record/Record.d.ts
- [ ] 2. Default — content/CreateRecord/constants/defaultRecord.ts
- [ ] 3. Create UI — CreateRecord.tsx and/or RecordTimes.tsx / RecordSurcharges.tsx
- [ ] 4. Persist — createRecordHandler in CreateRecord.tsx (updateObject)
- [ ] 5. Edit UI — EditRecord/Editrecord.tsx (getTimeSettingLabel if time_settings)
- [ ] 6. Table — hooks/useRecordsTableColumns.tsx (if visible in list)
- [ ] 7. Query fields — EditRecords.tsx useFindData fields array
- [ ] 8. Context — PatflowAppContextProvider Record query (if app-wide)
- [ ] 9. Calculations — packages/provider/src/patflow/functions/ (if affects saldo/vacation)
- [ ] 10. Records UI — packages/modules/src/patflow/Record/ (if affects /records page)
```

### Field placement guide

| Field belongs to | Update |
|------------------|--------|
| `time_settings.*` | `RecordTimeSettings` type, `RecordTimes.tsx` renderFields, `defaultRecord.time_settings` |
| Top-level Record | `Record` type, `defaultRecord`, `CreateRecord` handler + validation |
| Surcharge assignment | `Record.surcharges`, `RecordSurcharges.tsx`, `createRecordHandler` |
| Display-only in table | `useRecordsTableColumns.tsx` |
| Display in edit slide-in | `Editrecord.tsx` |

## Checklist: add a time_settings sub-field

1. Extend `RecordTimeSettings` in `Record.d.ts`
2. Add default in `defaultRecord.ts` → `time_settings`
3. Add form field in `RecordTimes.tsx` → `renderFields` array (match existing field shape: `name`, `type`, `dataType`, `label`)
4. `Editrecord.tsx` → add case in `getTimeSettingLabel()`
5. If used in day generation: check `createInitialTimes` in `@repo/provider`

## Surcharges on records

**Project surcharges** (tab Zuschläge): `SurchargeSettings/` → creates `Surcharge` Parse objects.

**Per-record assignment** (CreateRecord flow):
- `RecordSurcharges` reads active surcharges from `useDataStore()` (populated by `PatflowAppContextProvider`)
- Selected IDs stored in local `surcharges` state → saved as `surcharges: string[]` on create
- Modal opened via "Zuschläge hinzufügen/bearbeiten" button in CreateRecord

When changing surcharge behavior, also check:
- `packages/modules/src/patflow/Record/RecordsOverview/.../PrintWorkerTimes/` (render/export)
- `packages/provider/src/patflow/functions/time_records/getOvertimeSaldo.ts`

## CreateRecord flow

1. TimeSettings header → "Neuen Record erstellen"
2. Modal: `SelectUser` picks worker
3. SlideIn: year selection, holiday template, surcharges modal
4. Secondary panel (`RecordTimes`): adopt previous record OR enter new time_settings
5. Submit → `createInitialTimes()` generates `default_times` → `createData({ className: "Record", ... })`

Required for submit: `time_settings`, `start_date`, `end_date`, `holiday_template` (unless adopting)

## EditRecords table columns

Current columns in `useRecordsTableColumns.tsx`: Jahr, Nutzer, Start, Ende, Arbeitszeit, Urlaub, Saldo, Details.

Add new column via `ColumnDef<Record>` with German header labels.

## Related provider code

| File | Role |
|------|------|
| `PatflowAppContextProvider.tsx` | Loads records, surcharges, holidays into data store |
| `provider/.../recordFunctions.ts` | Record/day calculations |
| `provider/.../createInitialTimes` | Generates default_times for new records |
| `useDataStore.ts` | `surcharges` state for RecordSurcharges |

## Verify changes

```bash
npm run dev:patflow
```

1. Go to **Einstellungen → Zeiten und Zuschläge**
2. Test the relevant tab (Zuschläge / Feiertage / Zeiterfassung)
3. For Record changes: create or view a record, confirm field persists
4. For calculation changes: check **Zeiterfassung** (`/records`) staff view

## Conventions

- UI labels in German; code identifiers in English
- Use `useFindData` for reads, `useDataHandler` for Record CRUD in settings (existing pattern in CreateRecord)
- Form fields use `@repo/ui` `Form` component with `fields` array pattern
- Minimize scope — only touch files in the checklist relevant to your field
