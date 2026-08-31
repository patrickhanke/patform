"use client";

import { ColumnDef, IconButton, TableColumnDeleteField } from "@repo/ui";
import { ApolloRefetch, CompetitionClass } from "@repo/types";

export const getCompetitionOverviewColumns = (
	refetch: ApolloRefetch
): ColumnDef<CompetitionClass>[] => [
	{
		accessorFn: (row) => row.title,
		header: () => <span>Titel</span>,
		id: "title",
		cell: (info) => info.getValue(),
		footer: (info) => info.column.id,
		enableSorting: false
	},
	{
		accessorFn: (row) => row.season || "—",
		header: () => <span>Saison</span>,
		id: "season",
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
					link={`/competitions/${row.objectId}`}
					icon="link"
				/>
				<TableColumnDeleteField
					objectId={row.objectId}
					className="Competition"
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
