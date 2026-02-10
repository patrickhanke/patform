# TableColumnEmailSettings

A comprehensive email settings component for managing user email addresses and their list memberships.

## Features

- 📧 **Email Management**: View all email addresses associated with a user
- 📋 **List Management**: Add or remove users from email lists (Items of type "list" from database)
- 🔒 **Project Filtering**: Only lists from the current project are shown and editable
- 🌍 **Multi-Project Support**: Preserves lists from other projects without modification
- ➕ **Add New Emails**: Add new email addresses to a user's profile
- 💾 **Save on Confirm**: Changes are kept in local state and only saved when clicking "Speichern"
- ❌ **Cancel Support**: Clicking "Abbrechen" discards all changes
- 🔄 **Real-time Updates**: Updates are reflected in UI after saving
- 📅 **Timestamp Tracking**: Automatically tracks opt-in and opt-out timestamps

## Usage

```tsx
import { TableColumnEmailSettings } from "@repo/ui";

<TableColumnEmailSettings
	userId={user.objectId}
	emails={user.emails}
	refetch={refetch}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `userId` | `string` | The objectId of the user |
| `emails` | `PatstoreUser["emails"]` | Array of email objects from the user |
| `refetch` | `ApolloRefetch` | Function to refetch user data after updates |

## Data Structure

### PatstoreUser["emails"]

```typescript
{
	email: string;
	lists: string[];  // Array of list objectIds
	settings: {
		[listId: string]: {
			optIn: string | null;   // ISO timestamp
			optOut: string | null;  // ISO timestamp
		}
	};
}[]
```

## Component Structure

- **TableColumnEmailSettings.tsx**: Main component with SlideIn management
- **components/EmailList.tsx**: Displays the list of email addresses
- **components/EmailListManager.tsx**: Manages list membership for a specific email
- **components/AddEmailForm.tsx**: Form to add a new email address
- **hooks/useEmailListsState.ts**: Custom hook for managing local email state before saving

## Workflow

1. User clicks the email icon button
2. SlideIn opens showing all email addresses with list counts
3. Email addresses display:
   - Number of lists from the current project
   - Number of lists from other projects (if any)
4. User can:
   - Click on an email to manage its list memberships (opens secondary content)
   - Add a new email address (opens secondary content with form)
   - Make multiple changes across different emails
5. When managing lists:
   - Only lists from the current project are shown in `ElementSelectInterface`
   - Lists from other projects are preserved and not modified
   - Changes are stored in local state (not saved yet)
   - User can see changes reflected immediately in the UI
6. User saves or cancels:
   - Click "Speichern" → All changes are saved to database with timestamps
   - Click "Abbrechen" → All changes are discarded, state resets to original

## State Management

### Custom Hook: `useEmailListsState`

The component uses a custom hook to manage state locally before saving:

**Features:**
- Maintains a local copy of emails array
- Tracks whether changes have been made
- Updates email lists without immediate database writes
- Adds new email addresses to local state
- Generates final emails with timestamps when saving
- Resets to original state on cancel

**Key Functions:**
- `updateEmailLists(emailIndex, newLists)`: Update lists for a specific email
- `addEmail(newEmail)`: Add a new email address
- `getFinalEmails(originalEmails)`: Get final emails with timestamps
- `reset()`: Reset to original state

## Database Updates

When the user clicks "Speichern", the component updates the `_User` class with the following structure:

```javascript
{
	emails: [
		{
			email: "user@example.com",
			lists: ["listId1", "listId2"],
			settings: {
				"listId1": {
					optIn: "2026-02-10T12:00:00.000Z",
					optOut: null
				},
				"listId2": {
					optIn: "2026-02-10T13:00:00.000Z",
					optOut: "2026-02-10T14:00:00.000Z"
				}
			}
		}
	]
}
```

**Timestamp Logic:**
- `optIn`: Set when a list is added to an email
- `optOut`: Set when a list is removed from an email
- Timestamps are only updated when saving (clicking "Speichern")

## Lists Source

The component fetches lists from the database:
- **Class**: `Item`
- **Type**: `list`
- **Fields**: `objectId`, `title`
- **Filtered by**: `currentModule.objectId` (only current project)

### Multi-Project Handling

The component intelligently handles email addresses that are subscribed to lists from multiple projects:

1. **Display**: Shows separate counts for current project lists and other project lists
2. **Editing**: Only allows editing of lists from the current project
3. **Preservation**: Maintains all list subscriptions from other projects without modification
4. **Updates**: When saving, combines other project lists with newly selected current project lists

Example:
```typescript
// Email has lists from multiple projects
email.lists = ["project1List1", "project2List1", "project2List2"]

// When in Project 1:
// - Shows: "1 Listen (dieses Projekt)" + "2 Listen (andere Projekte)"
// - Editable: Only "project1List1"
// - After editing: Preserves "project2List1" and "project2List2"
```

## Dependencies

- `@repo/ui`: UI components (SlideIn, IconButton, ElementSelectInterface, TextInput)
- `@repo/provider`: Data handling (useDataHandlerSecure, useFindData, PatstoreAppContext)
- `@repo/types`: Type definitions (PatstoreUser, ApolloRefetch)
- `lodash-es`: cloneDeep for immutable updates
