# State Management Flow

## Overview

The `TableColumnEmailSettings` component uses a custom hook (`useEmailListsState`) to manage all changes locally before saving to the database. This provides a better UX by allowing users to make multiple changes and then save them all at once, or cancel and discard all changes.

## State Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  User clicks Email Icon                                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  SlideIn Opens                                               │
│  - Load project lists from database                          │
│  - Initialize localEmails from props.emails                  │
│  - hasChanges = false                                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  User makes changes (any combination):                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. Click email → Select/deselect lists               │   │
│  │    → updateEmailLists(index, newLists)               │   │
│  │    → Updates localEmails                             │   │
│  │    → hasChanges = true                               │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 2. Add new email address                             │   │
│  │    → addEmail(newEmail)                              │   │
│  │    → Adds to localEmails                             │   │
│  │    → hasChanges = true                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  Changes are immediately visible in UI                      │
│  but NOT saved to database yet                              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
           ┌──────────┴──────────┐
           │                     │
           ▼                     ▼
┌──────────────────┐  ┌──────────────────────────┐
│ User clicks      │  │ User clicks              │
│ "Abbrechen"      │  │ "Speichern"              │
└────────┬─────────┘  └────────┬─────────────────┘
         │                     │
         ▼                     ▼
┌──────────────────┐  ┌──────────────────────────┐
│ reset()          │  │ getFinalEmails()         │
│ - Restore        │  │ - Clone localEmails      │
│   original       │  │ - Compare with original  │
│   emails         │  │ - Add timestamps:        │
│ - hasChanges     │  │   * optIn for added      │
│   = false        │  │   * optOut for removed   │
│ - Close SlideIn  │  │ - Save to database       │
│                  │  │ - Refetch data           │
│                  │  │ - Close SlideIn          │
└──────────────────┘  └──────────────────────────┘
```

## Key Concepts

### Local State (localEmails)
- Initialized from `props.emails` when component mounts
- Updated whenever user makes changes
- Used for display in the UI
- Only written to database when user clicks "Speichern"

### Change Tracking (hasChanges)
- Boolean flag indicating if any changes have been made
- Set to `true` when:
  - User adds/removes lists from an email
  - User adds a new email address
- Set to `false` when:
  - Component initializes
  - User clicks "Abbrechen" (reset)
  - User clicks "Speichern" (after save)

### Project Filtering (projectListIds)
- Set of list IDs belonging to current project
- Used to:
  - Filter which lists are shown in UI
  - Preserve lists from other projects when saving
  - Calculate accurate list counts per project

## Example Scenario

### Initial State
```javascript
props.emails = [
  {
    email: "user@example.com",
    lists: ["project1List1", "project2List1"],
    settings: { ... }
  }
]
```

### User Opens SlideIn (Project 1)
```javascript
localEmails = cloneDeep(props.emails)
// Shows: "1 Listen (dieses Projekt) + 1 Listen (andere Projekte)"
```

### User Adds a List
```javascript
// User clicks email, adds "project1List2"
updateEmailLists(0, ["project1List1", "project1List2"])

localEmails = [
  {
    email: "user@example.com",
    lists: ["project2List1", "project1List1", "project1List2"],
    //      ↑ preserved    ↑ existing      ↑ newly added
    settings: { ... }
  }
]
hasChanges = true
```

### User Clicks "Speichern"
```javascript
finalEmails = getFinalEmails(props.emails)
// Compares localEmails with props.emails
// Finds: "project1List2" was added
// Adds timestamp:

finalEmails = [
  {
    email: "user@example.com",
    lists: ["project2List1", "project1List1", "project1List2"],
    settings: {
      "project1List2": {
        optIn: "2026-02-10T14:30:00.000Z",  // ← Added
        optOut: null
      }
    }
  }
]

// Saves to database
await updateData({ emails: finalEmails })
await refetch()
```

### User Clicks "Abbrechen"
```javascript
reset()
localEmails = cloneDeep(props.emails) // Back to original
hasChanges = false
// All changes discarded
```

## Benefits

1. **Better UX**: Users can make multiple changes before committing
2. **Cancel Support**: Easy to discard all changes at once
3. **Performance**: Only one database write instead of multiple
4. **Data Safety**: Changes are validated before saving
5. **Multi-Project Safety**: Other project lists are always preserved
6. **Clear State**: Users know changes aren't saved until they click "Speichern"

## Implementation Details

### useEmailListsState Hook

**Exports:**
- `localEmails`: Current state of emails
- `hasChanges`: Boolean indicating if changes exist
- `updateEmailLists(index, lists)`: Update lists for specific email
- `addEmail(email)`: Add new email address
- `getFinalEmails(original)`: Get final emails with timestamps
- `reset()`: Reset to original state

**Internal Logic:**
- Uses `useEffect` to sync with props.emails
- Uses `cloneDeep` to avoid mutations
- Filters by `projectListIds` to preserve other project data
- Calculates timestamps by comparing original vs. current state
