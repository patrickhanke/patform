"use client";

import { ColumnDef, IconButton, TableColumnDeleteField } from "@repo/ui";
import { ApolloRefetch, LanguageValue, PrellballClubClass } from "@repo/types";

export const getClubOverviewColumns = (
	refetch: ApolloRefetch,
	language?: LanguageValue
): ColumnDef<PrellballClubClass>[] => [
	{
		accessorFn: (row) =>
			(language && row.translations?.[language]?.title) || row.title,
		header: () => <span>Name</span>,
		id: "title",
		cell: (info) => info.getValue(),
		footer: (info) => info.column.id,
		enableSorting: false
	},
	{
		accessorFn: (row) => row.settings?.short || "—",
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
					link={`/vereine/${row.objectId}`}
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
