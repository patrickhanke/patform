"use client";

import { FC, useMemo } from "react";
import { ColumnDef, Table } from "@repo/ui";
import { ChampionshipGameRow, ChampionshipTabProps } from "../types";
import { getTeamLabel } from "../functions/getTeamLabel";
import { sortGames } from "../functions/spielplanSort";

const Schedule: FC<ChampionshipTabProps> = ({ championship, related }) => {
	const rows: ChampionshipGameRow[] = sortGames(championship.games).map(
		(game) => ({
			...game,
			objectId: game.id
		})
	);

	const columns: ColumnDef<ChampionshipGameRow>[] = useMemo(
		() => [
			{
				accessorFn: (row) => row.gameNr,
				header: () => <span>Spiel</span>,
				id: "gameNr",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => {
					const matchday = championship.matchdays.find(
						(item) =>
							item.id === row.eventId ||
							item.eventId === row.eventId
					);
					return matchday ? `Spieltag ${matchday.spieltagNr}` : "—";
				},
				header: () => <span>Spieltag</span>,
				id: "matchday",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => row.pass,
				header: () => <span>Durchgang</span>,
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
				accessorFn: (row) =>
					getTeamLabel(
						row,
						championship.games,
						championship.groups,
						championship.signups,
						related.entries,
						championship.show_class
					).team1.label,
				header: () => <span>Team 1</span>,
				id: "team1",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) =>
					getTeamLabel(
						row,
						championship.games,
						championship.groups,
						championship.signups,
						related.entries,
						championship.show_class
					).team2.label,
				header: () => <span>Team 2</span>,
				id: "team2",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) =>
					getTeamLabel(
						row,
						championship.games,
						championship.groups,
						championship.signups,
						related.entries,
						championship.show_class
					).referee.label,
				header: () => <span>Schiedsgericht</span>,
				id: "referee",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			}
		],
		[
			championship.games,
			championship.groups,
			championship.matchdays,
			championship.show_class,
			championship.signups,
			related.entries
		]
	);

	return (
		<div className="flex col a-st gap-sm">
			{championship.matchdays.length === 0 ? (
				<p>Spielplan erscheint, sobald Spieltage angelegt sind.</p>
			) : (
				<Table columns={columns} data={rows} />
			)}
		</div>
	);
};

export default Schedule;
