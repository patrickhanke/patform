"use client";

import { FC, useMemo } from "react";
import { ColumnDef, Table } from "@repo/ui";
import { CompetitionGameRow, CompetitionTabProps } from "../types";
import { getTeamLabel } from "../functions/getTeamLabel";
import { sortGames } from "../functions/spielplanSort";

const Schedule: FC<CompetitionTabProps> = ({ Competition, related }) => {
	const rows: CompetitionGameRow[] = sortGames(Competition.games).map(
		(game) => ({
			...game,
			objectId: game.id
		})
	);

	const columns: ColumnDef<CompetitionGameRow>[] = useMemo(
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
					const matchday = Competition.matchdays.find(
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
						Competition.games,
						Competition.groups,
						Competition.signups,
						related.clubs,
						Competition.show_class
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
						Competition.games,
						Competition.groups,
						Competition.signups,
						related.clubs,
						Competition.show_class
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
						Competition.games,
						Competition.groups,
						Competition.signups,
						related.clubs,
						Competition.show_class
					).referee.label,
				header: () => <span>Schiedsgericht</span>,
				id: "referee",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			}
		],
		[
			Competition.games,
			Competition.groups,
			Competition.matchdays,
			Competition.show_class,
			Competition.signups,
			related.clubs
		]
	);

	return (
		<div className="flex col a-st gap-sm">
			{Competition.matchdays.length === 0 ? (
				<p>Spielplan erscheint, sobald Spieltage angelegt sind.</p>
			) : (
				<Table columns={columns} data={rows} />
			)}
		</div>
	);
};

export default Schedule;
