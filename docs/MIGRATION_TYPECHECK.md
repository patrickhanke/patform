# TypeScript enforcement migration checklist

Phase 1 adds CI infrastructure without breaking existing builds. TypeScript errors are currently suppressed via `ignoreBuildErrors: true` in both apps. This document tracks the incremental path to full enforcement.

## Current state (Phase 1)

| Gate | CI status | Notes |
|------|-----------|-------|
| Vitest unit tests | **Required** | Starts with `@repo/provider` pure functions |
| Typecheck (scoped) | **Required** | `@repo/provider` pure functions (expand per migration doc) |
| Typecheck (full repo) | Advisory | `continue-on-error` until errors are fixed |
| Lint | Advisory | ~3.6k warnings (mostly Prettier); remove `continue-on-error` after cleanup |
| Dependency hygiene | Advisory | `manypkg` + `syncpack` report-only for now |
| Build | Advisory | Uses `.env.ci`; enable as required gate after local verification |

## Checklist: remove `ignoreBuildErrors`

Work through packages in dependency order (types → provider → ui → modules → apps).

### 1. `@repo/types`

- [ ] **Decouple types from UI/provider imports** — several `.d.ts` files import from `@repo/ui` and `@repo/provider`, which forces the entire monorepo into `tsc` (see `Module.d.ts`, `Date.d.ts`, etc.)
- [ ] Add `"rootDir": "src"` to `tsconfig.json` (done in Phase 1)
- [ ] Replace legacy `@/types/General` imports with `@repo/types` or relative paths
- [ ] Convert `.d.ts` files to `.ts` where practical
- [ ] Run `npm run typecheck -- --filter=@repo/types` until clean

### 2. `@repo/provider`

- [ ] Expand `tsconfig.typecheck.json` `include` globs package by package
- [ ] Add react/react-dom to devDependencies (manypkg requirement)
- [ ] Run `npm run typecheck -- --filter=@repo/provider` until full `src/` is included

### 3. `@repo/ui`

- [ ] Fix missing exports reported by downstream packages (e.g. `SiteHeader`)
- [ ] Add Vitest + Testing Library for isolated components
- [ ] Run `npm run typecheck -- --filter=@repo/ui` until clean

### 4. `@repo/modules`

- [ ] Replace self-referential `from "@repo/modules"` with relative imports
- [ ] Add missing SCSS module type declarations or fix import paths
- [ ] Run `npm run typecheck -- --filter=@repo/modules` until clean

### 5. Apps (`patflow`, `patstore`)

- [ ] Add `@repo/modules` to `apps/patflow/package.json` dependencies
- [ ] Add `transpilePackages` to `apps/patflow/next.config.js` (match patstore)
- [ ] **Remove secrets from `next.config.js`** — use `.env` only
- [ ] Set `typescript.ignoreBuildErrors: false` in one app, fix all errors
- [ ] Repeat for the second app
- [ ] Remove `eslint.ignoreDuringBuilds: true` from patflow

### 6. CI hardening

- [ ] Run `npm run lint -- -- --fix` (or per-package) to clear Prettier warnings
- [ ] Remove `continue-on-error` from lint CI job
- [ ] Remove `continue-on-error` from `typecheck-full` job
- [ ] Remove `continue-on-error` from `deps` job
- [ ] Promote `typecheck:ci` to full `typecheck` (delete scoped filter)
- [ ] Add Playwright E2E job for login + one critical flow per app

## Commands

```bash
# Enforced subset (matches CI)
npm run typecheck:ci

# Full repo (advisory until migration complete)
npm run typecheck

# Single package
npx turbo typecheck --filter=@repo/modules

# Tests
npm run test
npm run test:watch
```

## Definition of done

- All packages pass `tsc --noEmit` without scoped tsconfig filters
- Both apps build with `ignoreBuildErrors: false`
- CI has no advisory jobs with `continue-on-error`
- At least one Vitest test per package with non-trivial logic
