# GraphQL Edge Function Troubleshooting

## Error: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

### Cause
This error occurs when the GraphQL endpoint returns HTML (usually an error page) instead of JSON. This typically happens when:

1. **Environment variables are not configured**
2. **GraphQL URL is incorrect or unreachable**
3. **Parse Server GraphQL is not enabled**

### Solution

#### Step 1: Configure Environment Variables

Create or update `.env.local` in the root of your project with the following variables:

```env
# GraphQL URL (required for /api/graphql edge functions)
SASHIDO_GQL_URL=https://your-server.com/graphql

# Server-side credentials
SASHIDO_APP_ID=your-application-id
SASHIDO_REST_KEY=your-rest-api-key
SASHIDO_MASTER_KEY=your-master-key
SESSION_TOKEN=patstore_token

# Client-side credentials (if using original Apollo hooks)
NEXT_PUBLIC_SASHIDO_GQL_URL=https://your-server.com/graphql
NEXT_PUBLIC_SASHIDO_APP_ID=your-application-id
NEXT_PUBLIC_SASHIDO_REST_KEY=your-rest-api-key
```

**Important:** 
- For `patstore` app, create `.env.local` in the root directory
- For `patflow` app, create `.env.local` in the root directory
- Next.js automatically loads `.env.local` from the root directory

#### Step 2: Verify Your GraphQL URL

The GraphQL URL should point to your Parse Server's GraphQL endpoint. Common formats:

- SashiDo: `https://pg-app-xxxxx.parseapp.com/graphql`
- Self-hosted: `https://your-domain.com/parse/graphql`
- Local development: `http://localhost:1337/parse/graphql`

#### Step 3: Test Your GraphQL Endpoint

Test the endpoint directly using curl:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Parse-Application-Id: YOUR_APP_ID" \
  -H "X-Parse-REST-API-Key: YOUR_REST_KEY" \
  -d '{"query":"{ health }"}' \
  YOUR_GRAPHQL_URL
```

**Expected response:**
```json
{
  "data": {
    "health": true
  }
}
```

**If you get HTML:** The URL is wrong or GraphQL is not enabled.

#### Step 4: Restart Development Server

After adding environment variables, restart your dev server:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### Additional Checks

#### Check if Variables are Loaded

Add temporary logging to your edge function to verify variables are loaded:

```typescript
// In apps/patstore/app/api/graphql/route.ts (line ~54)
console.log('GraphQL URL:', process.env.SASHIDO_GQL_URL);
console.log('App ID:', process.env.SASHIDO_APP_ID ? 'Set' : 'Missing');
```

#### Verify Parse Server GraphQL is Enabled

If you're self-hosting Parse Server, ensure GraphQL is enabled in your configuration:

```javascript
// parse-server config
{
  databaseURI: 'mongodb://...',
  appId: 'myAppId',
  masterKey: 'myMasterKey',
  serverURL: 'http://localhost:1337/parse',
  // GraphQL must be mounted
  mountGraphQL: true,
  graphQLPath: '/graphql'
}
```

## Issue: Repeated API Calls (Infinite Loop)

### Symptoms
- `/api/graphql` endpoint called repeatedly (every few milliseconds)
- Browser console shows multiple identical requests
- High CPU usage
- Application feels slow/unresponsive

### Cause
This was caused by array dependencies (`fields`, `filters`) in React hooks creating new references on every render, triggering infinite re-renders.

### Solution
**✅ This has been fixed!** The secure hooks now use `useMemo` with `JSON.stringify` to stabilize array dependencies:

```typescript
// Stabilizes array references to prevent infinite loops
const fieldsKey = useMemo(() => JSON.stringify(fields), [fields]);
const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);
```

**If you still see this issue:**

1. **Check your component** - Ensure you're not passing new array literals on every render:

```typescript
// ❌ BAD - Creates new array every render
const { data } = useFindDataSecure({
  objectName: "User",
  fields: ["objectId", "name"], // New array reference!
  filters: [{ key: "status", operator: "equalTo", value: "active" }] // New array!
});

// ✅ GOOD - Use constants or useMemo
const USER_FIELDS = ["objectId", "name"];
const USER_FILTERS = [{ key: "status", operator: "equalTo", value: "active" }];

const { data } = useFindDataSecure({
  objectName: "User",
  fields: USER_FIELDS, // Stable reference
  filters: USER_FILTERS // Stable reference
});

// ✅ ALSO GOOD - Use useMemo for dynamic values
const filters = useMemo(() => [
  { key: "status", operator: "equalTo", value: status }
], [status]); // Only recreates when status changes

const { data } = useFindDataSecure({
  objectName: "User",
  fields: USER_FIELDS,
  filters // Stable until status changes
});
```

2. **Check polling** - Ensure you didn't accidentally set `pollInterval`:

```typescript
// If you don't need polling, omit pollInterval or set to 0
const { data } = useFindDataSecure({
  objectName: "User",
  fields: ["objectId", "name"],
  // pollInterval: 1000 // ❌ This causes requests every 1 second
});
```

3. **Clear browser cache and restart dev server**

## Other Common Errors

### Error: "SASHIDO_GQL_URL environment variable is not configured"

**Cause:** Environment variable is not set  
**Solution:** Add `SASHIDO_GQL_URL` to `.env.local` and restart server

### Error: "X-Parse-Application-Id is required"

**Cause:** Missing `SASHIDO_APP_ID` environment variable  
**Solution:** Add `SASHIDO_APP_ID` to `.env.local` and restart server

### Error: "Invalid session token"

**Cause:** User is not logged in or session expired  
**Solution:** 
- Verify user is logged in
- Check session cookie name matches `SESSION_TOKEN` env variable
- Try logging out and back in

### Error: "Unauthorized" or 403

**Cause:** ACL restrictions preventing access  
**Solution:**
- Use `useMasterKey: true` for admin operations (if appropriate)
- Check Parse Server ACLs and CLPs
- Verify user has permission to access the data

## Environment Variable Priority

Next.js loads environment variables in this order (later overrides earlier):

1. `.env` (all environments)
2. `.env.local` (all environments, ignored by git)
3. `.env.development` / `.env.production` (specific environment)
4. `.env.development.local` / `.env.production.local` (specific environment, ignored by git)

**Recommended:** Use `.env.local` for development secrets.

## Quick Checklist

When you see the "Unexpected token '<'" error:

- [ ] `.env.local` file exists in project root
- [ ] `SASHIDO_GQL_URL` is set in `.env.local`
- [ ] `SASHIDO_APP_ID` is set in `.env.local`
- [ ] `SASHIDO_REST_KEY` is set in `.env.local`
- [ ] GraphQL URL is correct (test with curl)
- [ ] Development server restarted after adding variables
- [ ] No typos in environment variable names
- [ ] Parse Server has GraphQL enabled

## Testing the Fix

After configuring environment variables:

1. Restart your dev server
2. Open your app in the browser
3. Open DevTools → Network tab
4. Trigger a query using the secure hooks
5. Check the `/api/graphql` request
6. Should see JSON response (not HTML)

## Need More Help?

1. Check Parse Server logs for errors
2. Verify your Parse Server configuration
3. Test GraphQL endpoint independently (Postman, GraphQL Playground)
4. Check [Parse Server GraphQL documentation](https://docs.parseplatform.org/graphql/guide/)

---

**Pro Tip:** Use `.env.example` as a template and copy it to `.env.local`, then fill in your actual values.
