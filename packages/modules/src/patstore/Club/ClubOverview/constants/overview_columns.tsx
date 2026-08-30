"use client";

import { ColumnDef, IconButton, TableColumnDeleteField } from "@repo/ui";
import { ApolloRefetch, ClubClass } from "@repo/types";

export const getClubOverviewColumns = (
	refetch: ApolloRefetch
): ColumnDef<ClubClass>[] => [
	{
		accessorFn: (row) => row.title,
		header: () => <span>Name</span>,
		id: "title",
		cell: (info) => info.getValue(),
		footer: (info) => info.column.id,
		enableSorting: false
	},
	{
		accessorFn: (row) => row.short || "—",
		header: () => <span>Kürzel</span>,
		id: "short",
		cell: (info) => info.getValue(),
		footer: (info) => info.column.id,
		enableSorting: false
	},
	{
		accessorFn: (row) =>
			row.updatedAt
				? new Date(row.updatedAt).toLocaleDateString("de-DE")
				: "—",
		header: () => <span>Aktualisiert</span>,
		id: "updatedAt",
		cell: (info) => info.getValue(),
		footer: (info) => info.column.id,
		enableSorting: false
	},
	{
		accessorFn: (row) => (
			<div className="button_container">
				<IconButton
					isLink
					link={`/clubs/${row.objectId}`}
					icon="link"
				/>
				<TableColumnDeleteField
					objectId={row.objectId}
					className="Club"
					refetch={refetch}
				/>
			</div>
		),
		header: () => <span>Bearbeiten</span>,
		id: "edit",
		cell: (info) => info.getValue(),
		footer: (info) => info.column.id,
		enableSorting: false
	}
];
