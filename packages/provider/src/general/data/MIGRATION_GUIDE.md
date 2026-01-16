# Migration Guide: Secure Data Handler

## Overview

This guide explains how to migrate from the direct client-side data handler (`useDataHandler`) to the secure server-side version (`useDataHandlerSecure`) that uses Next.js Edge Functions.

## Why Migrate?

**Security Benefits:**
- API keys and credentials are kept server-side only
- Database queries are not exposed in browser DevTools
- Master key operations are completely hidden from the client
- Reduced attack surface for potential security breaches

**Performance Benefits:**
- Edge Functions run closer to your users globally
- Reduced client-side JavaScript bundle size
- Better caching opportunities

## What Changed?

### Before (Client-Side)
```typescript
import useDataHandler from "@patform/provider/general/data/useDataHandler";

// Direct API calls from the browser
const { getData, createData, updateData, deleteData } = useDataHandler();
```

### After (Server-Side via Edge Functions)
```typescript
import useDataHandlerSecure from "@patform/provider/general/data/useDataHandlerSecure";

// API calls proxied through Next.js Edge Functions
const { getData, createData, updateData, deleteData } = useDataHandlerSecure();
```

## Migration Steps

### 1. Update Environment Variables

Ensure these variables are set in your Next.js app (`.env.local`):

```bash
# Parse Server Configuration
SASHIDO_APP_ID=your_app_id
SASHIDO_REST_KEY=your_rest_key
SASHIDO_MASTER_KEY=your_master_key
SASHIDO_API_URL=https://your-parse-server.com/parse

# Session Configuration
SESSION_TOKEN=patstore_token

# Optional: API base path (defaults to /api)
NEXT_PUBLIC_API_BASE=/api
```

**Important:** 
- Never expose `SASHIDO_MASTER_KEY` as `NEXT_PUBLIC_*`
- Server-only variables (without `NEXT_PUBLIC_` prefix) are only accessible in API routes

### 2. Update Your Components

Simply replace the import statement:

```typescript
// Old
import useDataHandler from "@patform/provider/general/data/useDataHandler";

// New
import useDataHandlerSecure from "@patform/provider/general/data/useDataHandlerSecure";
```

The API remains the same, so no other code changes are needed:

```typescript
const { getData, createData, updateData, deleteData, loading } = useDataHandlerSecure();

// Usage remains identical
const users = await getData({ className: "User" });
await createData({ className: "User", updateObject: { name: "John" } });
await updateData({ className: "User", objectId: "123", updateObject: { name: "Jane" } });
await deleteData({ className: "User", objectId: "123" });
```

### 3. Verify API Routes Exist

The following API routes should be created in both apps:

**For Patstore App:**
- `apps/patstore/app/api/data/route.ts`
- `apps/patstore/app/api/files/route.ts`

**For Patflow App:**
- `apps/patflow/app/api/data/route.ts`
- `apps/patflow/app/api/files/route.ts`

These routes handle:
- `GET /api/data` - Fetch data with optional queries
- `POST /api/data` - Create new records
- `PUT /api/data` - Update existing records
- `DELETE /api/data` - Delete records

### 4. Testing

Test all CRUD operations after migration:

```typescript
// Test reading
const data = await getData({ className: "TestClass" });

// Test creating
const result = await createData({
  className: "TestClass",
  updateObject: { name: "Test" }
});

// Test updating
await updateData({
  className: "TestClass",
  objectId: result.objectId,
  updateObject: { name: "Updated" }
});

// Test deleting
await deleteData({
  className: "TestClass",
  objectId: result.objectId
});
```

## API Reference

### `useDataHandlerSecure(useMasterKey?, useProjectKey?)`

**Parameters:**
- `useMasterKey` (boolean, optional): Whether to use master key for operations (default: false)
- `useProjectKey` (boolean, optional): Whether to automatically add project reference (default: true)

**Returns:**
- `loading` (boolean): Loading state
- `getData`: Fetch data from Parse
- `createData`: Create new records
- `updateData`: Update existing records
- `deleteData`: Delete records
- `uploadFile`: Upload files (uses Parse SDK directly)
- `createUpdateFile`: Create/update file records
- `updateImage`: Update image records

### Method Signatures

#### `getData({ className, query })`
```typescript
await getData({
  className: "User",
  query: '"email":"user@example.com"' // Optional Parse query
});
```

#### `createData({ className, updateObject, afterSaveHandler, feedback, userId })`
```typescript
await createData({
  className: "User",
  updateObject: { name: "John", email: "john@example.com" },
  afterSaveHandler: (data) => console.log("Created:", data),
  feedback: "User created successfully"
});
```

#### `updateData({ className, objectId, updateObject, afterSaveHandler, feedback, onError })`
```typescript
await updateData({
  className: "User",
  objectId: "abc123",
  updateObject: { name: "Jane" },
  afterSaveHandler: (id) => console.log("Updated:", id),
  feedback: "User updated successfully",
  onError: (error) => console.error(error)
});
```

#### `deleteData({ className, objectId, afterSaveHandler, feedback })`
```typescript
await deleteData({
  className: "User",
  objectId: "abc123",
  afterSaveHandler: (id) => console.log("Deleted:", id),
  feedback: "User deleted successfully"
});
```

## File Operations

File operations (`uploadFile`, `createUpdateFile`, `updateImage`) still use the Parse SDK directly as they require special handling for binary data. These operations are secure as they use session tokens for authentication.

## Rollback Plan

If you need to rollback:

1. Change imports back to `useDataHandler`
2. The old implementation still exists and is functional
3. No data migration is needed

## Common Issues

### Issue: "API routes not found"
**Solution:** Ensure the API routes are created in the correct location and the Next.js dev server is restarted.

### Issue: "Unauthorized" errors
**Solution:** Check that:
- Session token cookie is being set correctly
- Environment variables are properly configured
- The session token name matches between client and server

### Issue: Master key operations failing
**Solution:** Verify that `SASHIDO_MASTER_KEY` is set as a server-only variable (not `NEXT_PUBLIC_*`)

## Performance Considerations

- Edge Functions have cold start times (~50-200ms for first request)
- Subsequent requests are very fast (~10-50ms)
- Consider caching strategies for frequently accessed data
- The API routes can be extended with additional caching logic if needed

## Security Best Practices

1. **Never expose master key:** Always keep it server-side only
2. **Validate input:** The API routes should validate all incoming data
3. **Rate limiting:** Consider adding rate limiting to API routes
4. **Audit logging:** Add logging for sensitive operations
5. **CORS:** Configure CORS properly if calling from different domains

## Need Help?

- Review the Edge Function logs in Vercel/deployment platform
- Check browser Network tab for API call errors
- Verify environment variables are loaded correctly
- Test API routes directly using curl/Postman before client integration
