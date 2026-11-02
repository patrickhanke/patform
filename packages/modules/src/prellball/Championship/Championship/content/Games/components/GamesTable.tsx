"use client";

import { FC, useMemo } from "react";
import { ColumnDef, IconButton, Table } from "@repo/ui";
import { ChampionshipGame, ClubClass } from "@repo/types";
import { ChampionshipPageModel } from "../../../../types";
import { DivisionCategory } from "../../../../../functions/divisions";
import { championshipGameTypes } from "../constants/gameTypes";
import { Slot } from "../functions/gameSlot";
import GameTeamCell from "./GameTeamCell";

const teamColumns: { slot: Slot; header: string }[] = [
	{ slot: "team1", header: "Mannschaft 1" },
	{ slot: "team2", header: "Mannschaft 2" },
	{ slot: "referee", header: "Schiedsrichter" }
];

const GamesTable: FC<{
	page: ChampionshipPageModel;
	games: ChampionshipGame[];
	clubs: ClubClass[];
	divisions: DivisionCategory[];
	onEdit: (game: ChampionshipGame) => void;
	onDelete: (game: ChampionshipGame) => void;
}> = ({ page, games, clubs, divisions, onEdit, onDelete }) => {
	const columns: ColumnDef<ChampionshipGame>[] = useMemo(
		() => [
			{
				accessorFn: (row) =>
					page.data.match_days.find(
						(item) => item.id === row.match_day_id
					)?.number,
				header: () => <span>St.</span>,
				id: "matchday",
				cell: (info) => {
					const number = info.getValue() as number | undefined;
					return number ? `Spieltag ${number}` : "—";
				},
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => row.pass,
				header: () => <span>Dg.</span>,
				id: "pass",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => row.field,
				header: () => <span>Feld</span>,
				id: "field",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => row.game_nr,
				header: () => <span>Spiel</span>,
				id: "game_nr",
				cell: (info) =>
					info.row.original.locked
						? `${info.getValue()} (gesperrt)`
						: info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) =>
					championshipGameTypes.find(
						(item) => item.value === row.type
					)?.label || row.type,
				header: () => <span>Typ</span>,
				id: "type",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			...teamColumns.map(
				({ slot, header }): ColumnDef<ChampionshipGame> => ({
					id: slot,
					header: () => <span>{header}</span>,
					accessorFn: (row) => row.id,
					cell: (info) => (
						<GameTeamCell
							game={info.row.original}
							slot={slot}
							groups={page.data.groups}
							signups={page.data.sign_ups}
							clubs={clubs}
							games={page.data.games}
							showClass={page.settings.show_division}
							divisions={divisions}
						/>
					),
					footer: (info) => info.column.id
				})
			),
			{
				id: "edit",
				header: () => <span>Bearbeiten</span>,
				accessorFn: (row) => row.id,
				cell: (info) => (
					<div className="button_container">
						<IconButton
							icon="edit"
							onClick={() => onEdit(info.row.original)}
						/>
						<IconButton
							icon="delete"
							onClick={() => onDelete(info.row.original)}
						/>
					</div>
				),
				footer: (info) => info.column.id
			}
		],
		[page, clubs, divisions, onEdit, onDelete]
	);

	return (
		<Table
			columns={columns}
			data={games}
			rowIdResolver={(row) => (row as ChampionshipGame).id}
		/>
	);
};

export default GamesTable;
