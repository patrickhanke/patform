# List Component

This component allows editing of a specific email list.

## Structure

- `List.tsx` - Main component that manages the page states
- `constants/` - Contains site states configuration
- `content/` - Contains sub-components for each page state
  - `ListSettings/` - Allows editing the list title and type (static/dynamic)
    - `components/ListDynamicFilter.tsx` - Dynamic filter configuration
  - `ListMembers/` - Allows selecting users to add to the list (only for static lists)
- `functions/` - Utility functions
  - `generateUUID.ts` - Generates UUIDs for recipient keys

## Page States

1. **Settings** - Edit the title and configure list type
2. **Members** - Select users to be on the list (only visible for static lists)

## List Types

### Static Lists
Static lists contain manually selected members. When `settings.static_list === true`:
- The "Members" page state is available
- Users can manually select recipients
- Recipients are stored in `data.recipients[]`

### Dynamic Lists
Dynamic lists are automatically populated based on filter criteria. When `settings.static_list === false`:
- The "Members" page state is hidden
- Filter configuration is shown in Settings
- Currently supported filter: `newsletter_optin === true`

## Data Structure

Lists are stored as `Item` objects with `type === "list"`.

### Settings Structure
```typescript
{
  static_list: boolean;      // true for static, false for dynamic
  newsletter_optin?: boolean; // Filter setting for dynamic lists
}
```

### Recipients Structure (Static Lists Only)
Recipients are stored in `data.recipients` as an array of objects:

```typescript
{
  email: string;
  name: string;
  key: string; // UUID
}
```

## Usage

```tsx
import { List } from "@repo/modules";

<List params={{ list_id: "abc123" }} />
```
