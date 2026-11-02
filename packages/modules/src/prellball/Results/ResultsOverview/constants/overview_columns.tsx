"use client";

import { ColumnDef, IconButton, TableColumnDeleteField } from "@repo/ui";
import {
	ApolloRefetch,
	CategoryClass,
	ChampionshipClass,
	LanguageValue
} from "@repo/types";
import { seasonCategoryTitle } from "../../../functions/season";

export const getResultsOverviewColumns = (
	refetch: ApolloRefetch,
	language?: LanguageValue,
	seasons: CategoryClass[] = []
): ColumnDef<ChampionshipClass>[] => [
	{
		accessorFn: (row) =>
			(language && row.translations?.[language]?.title) || row.title,
		header: () => <span>Titel</span>,
		id: "title",
		cell: (info) => info.getValue(),
		footer: (info) => info.column.id,
		enableSorting: false
	},
	{
		accessorFn: (row) => seasonCategoryTitle(row.categories, seasons),
		header: () => <span>Saison</span>,
		id: "season",
		cell: (info) => info.getValue(),
		footer: (info) => info.column.id,
		enableSorting: false
	},
	{
		accessorFn: (row) => row.category || "—",
		header: () => <span>Kategorie</span>,
		id: "category",
		cell: (info) => info.getValue(),
		footer: (info) => info.column.id,
		enableSorting: false
	},
	{
		accessorFn: (row) => (
			<div className="button_container">
				<IconButton
					isLink
					link={`/championships/results/${row.objectId}`}
					icon="link"
				/>
				<TableColumnDeleteField
					objectId={row.objectId}
					className="Championship"
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
