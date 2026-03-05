# Integration Example

## Using TableColumnEmailSettings in a Table

### Example: User Overview Table

```tsx
import { useCreateColumns } from "@repo/ui";
import { TableColumnEmailSettings } from "@repo/ui";

// In your component
const UsersOverview = () => {
	const { data: users, refetch } = useFindData({
		objectName: "User",
		fields: ["objectId", "username", "email", "emails"],
		// ... other options
	});

	const columns = useMemo(() => [
		{
			accessorKey: "username",
			header: "Benutzername",
			cell: ({ row }) => row.original.username
		},
		{
			accessorKey: "email",
			header: "Haupt-E-Mail",
			cell: ({ row }) => row.original.email
		},
		{
			accessorKey: "emails",
			header: "E-Mail-Listen",
			cell: ({ row }) => (
				<TableColumnEmailSettings
					userId={row.original.objectId}
					emails={row.original.emails}
					refetch={refetch}
				/>
			)
		}
	], [refetch]);

	return (
		<Table
			data={users}
			columns={columns}
			// ... other props
		/>
	);
};
```

## Integration in useCreateColumns Hook

If you want to add this as a standard column type in the `useCreateColumns` hook:

```tsx
// In useCreateColumns.tsx

import { TableColumnEmailSettings } from "../content/TableColumnEmailSettings#";

// Add to the column creation logic
case "emails":
	return {
		accessorKey: columnConfig.key,
		header: columnConfig.label,
		cell: ({ row }) => (
			<TableColumnEmailSettings
				userId={row.original.objectId}
				emails={row.original.emails}
				refetch={refetch}
			/>
		)
	};
```

## Column Configuration Example

```tsx
const columnConfigs = [
	{
		key: "username",
		label: "Benutzername",
		type: "string"
	},
	{
		key: "emails",
		label: "E-Mail-Listen",
		type: "emails"  // Custom type for email settings
	}
];
```

## Features in Action

1. **Icon Button**: Displays an email icon in the table cell
2. **SlideIn Main Content**: Shows list of all user's email addresses
3. **SlideIn Secondary Content**: 
   - Opens when clicking an email to manage lists
   - Opens when adding a new email address
4. **Auto-save**: All changes are saved immediately to the database
5. **Timestamps**: Tracks when users opt-in/out of lists

## Required User Fields

Make sure to fetch these fields from the `User` class:

```tsx
fields: [
	"objectId",      // Required for userId
	"emails",        // Required for emails array
	// ... other fields you need
]
```

## Example with Module Context

If using in a module that needs PatstoreAppContext:

```tsx
import { PatstoreAppContext } from "@repo/provider";

const MyComponent = () => {
	const { currentModule } = useContext(PatstoreAppContext);

	// The TableColumnEmailSettings component internally uses
	// currentModule.objectId to fetch lists, so make sure
	// the component is wrapped in PatstoreAppContext.Provider

	return (
		<TableColumnEmailSettings
			userId={user.objectId}
			emails={user.emails}
			refetch={refetch}
		/>
	);
};
```

## Permissions

Ensure the user has permission to:
- Read from `User` class
- Update `User` class (for email modifications)
- Read from `Item` class with `type: "list"` (for fetching lists)
