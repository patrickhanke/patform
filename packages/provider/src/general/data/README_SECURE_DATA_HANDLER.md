# Secure Data Handler

## Overview

The Secure Data Handler (`useDataHandlerSecure`) is a React hook that provides secure server-side data operations through Next.js Edge Functions. This approach keeps sensitive API credentials and database queries on the server, preventing exposure in the browser.

## Architecture

```
┌─────────────────┐
│  React Client   │
│  (Browser)      │
└────────┬────────┘
         │
         │ fetch()
         │
┌────────▼─────────┐
│  Next.js Edge    │
│  Functions       │
│  /api/data       │
└────────┬─────────┘
         │
         │ axios + Parse Headers
         │
┌────────▼─────────┐
│  Parse Server    │
│  (Backend DB)    │
└──────────────────┘
```

## Benefits

### Security
- **API Keys Protected:** All API keys remain server-side
- **Query Privacy:** Database queries not visible in browser
- **Master Key Safety:** Master key operations completely hidden
- **Session Management:** Session tokens handled securely

### Performance
- **Edge Computing:** Functions run globally near users
- **Reduced Bundle:** Less client-side JavaScript
- **Caching:** Easier to implement server-side caching

### Maintainability
- **Centralized Logic:** Business logic in API routes
- **Type Safety:** TypeScript support throughout
- **Error Handling:** Consistent error handling patterns

## Quick Start

```typescript
import useDataHandlerSecure from "@patform/provider/general/data/useDataHandlerSecure";

function MyComponent() {
  const { getData, createData, updateData, deleteData, loading } = 
    useDataHandlerSecure();

  const fetchUsers = async () => {
    const users = await getData({ className: "User" });
    console.log(users);
  };

  return (
    <div>
      <button onClick={fetchUsers} disabled={loading}>
        {loading ? "Loading..." : "Fetch Users"}
      </button>
    </div>
  );
}
```

## API Methods

### `getData()`
Fetch data from Parse Server with optional query filtering.

```typescript
// Fetch all records
const users = await getData({ className: "User" });

// Fetch with query
const activeUsers = await getData({ 
  className: "User",
  query: '"active":true,"role":"admin"'
});
```

### `createData()`
Create new records in Parse Server.

```typescript
await createData({
  className: "User",
  updateObject: {
    name: "John Doe",
    email: "john@example.com",
    active: true
  },
  afterSaveHandler: (data) => {
    console.log("Created user:", data.objectId);
  },
  feedback: "User created successfully"
});
```

### `updateData()`
Update existing records.

```typescript
await updateData({
  className: "User",
  objectId: "abc123",
  updateObject: {
    name: "Jane Doe",
    lastLogin: new Date()
  },
  afterSaveHandler: (id) => {
    console.log("Updated user:", id);
  },
  feedback: "User updated",
  onError: (error) => {
    console.error("Update failed:", error);
  }
});
```

### `deleteData()`
Delete records from Parse Server.

```typescript
await deleteData({
  className: "User",
  objectId: "abc123",
  afterSaveHandler: (id) => {
    console.log("Deleted user:", id);
  },
  feedback: "User deleted successfully"
});
```

### `uploadFile()`
Upload files to Parse Server (uses Parse SDK directly).

```typescript
const file = document.querySelector('input[type="file"]').files[0];
const parseFile = await uploadFile({ file });
console.log("File URL:", parseFile.url());
```

### `createUpdateFile()`
Create or update file records with metadata.

```typescript
await createUpdateFile({
  file: myFile,
  name: "Document.pdf",
  className: "Download",
  classKey: "file",
  moduleId: "module123",
  feedback: "File uploaded successfully",
  afterSaveHandler: (data) => {
    console.log("File saved:", data);
  }
});
```

### `updateImage()`
Update image records.

```typescript
await updateImage({
  file: imageBlob,
  name: "profile.jpg",
  imageId: "img123",
  feedback: "Image updated",
  afterSaveHandler: (data) => {
    console.log("Image updated:", data);
  }
});
```

## Configuration

### Environment Variables

Create `.env.local` in your Next.js app:

```bash
# Parse Server (Server-side only - no NEXT_PUBLIC_ prefix)
SASHIDO_APP_ID=your_app_id_here
SASHIDO_REST_KEY=your_rest_api_key_here
SASHIDO_MASTER_KEY=your_master_key_here
SASHIDO_API_URL=https://your-parse-server.com/parse

# Session Token Name
SESSION_TOKEN=patstore_token

# Optional: Custom API base path
NEXT_PUBLIC_API_BASE=/api
```

### Hook Options

```typescript
const handler = useDataHandlerSecure(useMasterKey, useProjectKey);
```

- **`useMasterKey`** (boolean, default: `false`): Use Parse master key for operations
- **`useProjectKey`** (boolean, default: `true`): Automatically add project reference to records

## Advanced Usage

### With Queries

```typescript
// Complex query
const results = await getData({
  className: "Task",
  query: JSON.stringify({
    status: "active",
    priority: { $gte: 5 },
    assignedTo: {
      __type: "Pointer",
      className: "User",
      objectId: user.objectId
    }
  })
});
```

### With Callbacks

```typescript
await createData({
  className: "Task",
  updateObject: { title: "New Task" },
  afterSaveHandler: (data) => {
    // Refresh UI
    refreshTasks();
    // Navigate to new task
    router.push(`/tasks/${data.objectId}`);
  },
  feedback: "Task created!"
});
```

### Error Handling

```typescript
await updateData({
  className: "Task",
  objectId: taskId,
  updateObject: { status: "completed" },
  onError: (error) => {
    console.error("Failed to complete task:", error);
    // Show error to user
    showErrorNotification(error);
  }
});
```

### Loading States

```typescript
function MyComponent() {
  const { getData, loading } = useDataHandlerSecure();
  const [data, setData] = useState([]);

  useEffect(() => {
    getData({ className: "Task" }).then(setData);
  }, []);

  if (loading) return <Spinner />;
  return <DataTable data={data} />;
}
```

## Edge Function Details

### Request Flow

1. **Client Call:** Component calls hook method (e.g., `getData()`)
2. **Fetch Request:** Hook sends request to `/api/data`
3. **Edge Function:** Route handler validates and processes request
4. **Parse API:** Edge function calls Parse Server with credentials
5. **Response:** Data flows back through the chain to client

### Headers

Edge functions automatically include:
- `X-Parse-Application-Id`: Your app ID
- `X-Parse-REST-API-Key`: REST API key
- `X-Parse-Session-Token`: User's session token (from cookies)
- `X-Parse-Master-Key`: Master key (only if `useMasterKey=true`)

### Automatic Fields

The edge functions automatically add:
- `created_by`: User who created the record (on create)
- `updated_by`: User who updated the record (on update)
- `project`: Associated project (if `useProjectKey=true`)

## Security Considerations

### What's Protected
✅ API keys and credentials  
✅ Master key operations  
✅ Database queries and structure  
✅ Internal business logic  

### What's Not Protected
⚠️ Data returned to client (still visible in browser)  
⚠️ Session tokens (stored in cookies)  
⚠️ Client-side validation (still needed)  

### Best Practices

1. **Validate on Server:** Add validation in edge functions
2. **Rate Limiting:** Implement rate limits on API routes
3. **Authentication:** Verify session tokens before operations
4. **Authorization:** Check user permissions in edge functions
5. **Audit Logging:** Log sensitive operations
6. **Input Sanitization:** Sanitize user input before database operations

## Testing

### Unit Tests

```typescript
import { renderHook, act } from "@testing-library/react";
import useDataHandlerSecure from "./useDataHandlerSecure";

describe("useDataHandlerSecure", () => {
  it("should fetch data", async () => {
    const { result } = renderHook(() => useDataHandlerSecure());
    
    let data;
    await act(async () => {
      data = await result.current.getData({ className: "User" });
    });
    
    expect(data).toBeDefined();
  });
});
```

### Integration Tests

```typescript
// Test API route directly
const response = await fetch("/api/data?className=User");
const data = await response.json();
expect(data.results).toBeInstanceOf(Array);
```

## Troubleshooting

### Common Errors

**"API routes not found"**
- Check API route files exist in correct location
- Restart Next.js dev server
- Verify file naming: `route.ts` (not `route.tsx`)

**"Unauthorized" errors**
- Check session token cookie is set
- Verify environment variables
- Confirm SESSION_TOKEN name matches

**"Master key required"**
- Set `useMasterKey: true` in hook
- Ensure SASHIDO_MASTER_KEY is set (server-only)
- Check Parse Server ACL/CLP settings

### Debug Mode

Enable debug logging:

```typescript
// In edge function (route.ts)
console.log("Request:", {
  className,
  query,
  useMasterKey,
  sessionToken: sessionToken ? "present" : "missing"
});
```

## Migration from Old Hook

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed migration instructions from `useDataHandler` to `useDataHandlerSecure`.

## Performance Tips

1. **Batch Operations:** Group multiple operations when possible
2. **Caching:** Implement caching in edge functions for read-heavy operations
3. **Pagination:** Use Parse query limits for large datasets
4. **Debouncing:** Debounce rapid successive calls
5. **Selective Loading:** Only fetch fields you need

## Contributing

When extending the secure data handler:

1. Add new methods to both `useDataHandlerSecure` hook and edge function
2. Maintain backward compatibility with existing API
3. Add TypeScript types for all parameters
4. Update documentation with examples
5. Add tests for new functionality

## License

Part of the Patform monorepo.
