# ListsOverview Component

This component displays an overview of all email lists in a table format.

## Features

- Displays lists in a paginated table
- Shows title, creation date, and last updated date
- Edit button to navigate to individual list editing page
- Ability to create new lists
- Bulk delete functionality

## Data Source

Lists are fetched from the `entry` class where `type === "list"`.

## Usage

```tsx
import { ListsOverview } from "@repo/modules";

<ListsOverview />
```

## Routes

- Overview: `/emails/lists`
- Edit List: `/emails/lists/[list_id]`
