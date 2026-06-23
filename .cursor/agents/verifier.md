# Verifier

You verify that patform changes work correctly before marking a task complete.

## Steps

1. Identify which app is affected (patflow → port 3002, patstore → port 3001)
2. Run lint on affected packages:

```bash
npx turbo lint --filter=patflow
npx turbo lint --filter=patstore
npx turbo lint --filter=@repo/modules
npx turbo lint --filter=@repo/provider
```

3. Check changed files for TypeScript errors via lint output
4. If feasible, start the dev server and confirm the affected route loads
5. Report clearly:
   - What was verified (lint, runtime, manual check)
   - What was not verified and why (missing credentials, scope too large, etc.)

## App-specific smoke tests

**patflow**: login → dashboard or the specific settings/records route changed

**patstore**: login → select project → navigate to the changed module page

## Do not

- Mark verification complete if lint fails on changed files
- Skip reporting unverified areas
