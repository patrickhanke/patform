"use client";

import { FC, useMemo, useState } from "react";
import { ColumnDef, Select, Table } from "@repo/ui";
import { ChampionshipGame } from "@repo/types";
import { ChampionshipGameRow, ChampionshipTabProps } from "../types";
import ChampionshipScoreCell from "../components/ChampionshipScoreCell";
import { getTeamLabel } from "../functions/getTeamLabel";
import { sortGames } from "../functions/spielplanSort";
import { recalcChampionshipStandings } from "../functions/tableHandler";
import { selectString } from "../functions/selectValue";

const winnerLoserFromScores = (
	_game: ChampionshipGame,
	score1: number | null | undefined,
	score2: number | null | undefined,
	team1SignupId?: string,
	team2SignupId?: string
) => {
	if (
		typeof score1 !== "number" ||
		typeof score2 !== "number" ||
		!team1SignupId ||
		!team2SignupId
	) {
		return { winnerSignupId: null, loserSignupId: null };
	}
	if (score1 > score2) {
		return { winnerSignupId: team1SignupId, loserSignupId: team2SignupId };
	}
	if (score2 > score1) {
		return { winnerSignupId: team2SignupId, loserSignupId: team1SignupId };
	}
	return { winnerSignupId: null, loserSignupId: null };
};

const Results: FC<ChampionshipTabProps> = ({
	championship,
	related,
	onUpdate,
	loading
}) => {
	const sortedMatchdays = [...championship.matchdays].sort(
		(a, b) => a.spieltagNr - b.spieltagNr
	);
	const [matchdayId, setMatchdayId] = useState(sortedMatchdays[0]?.id || "");
	const activeMatchday =
		sortedMatchdays.find((item) => item.id === matchdayId) ||
		sortedMatchdays[0];

	const matchdayOptions = sortedMatchdays.map((matchday) => ({
		value: matchday.id,
		label: `Spieltag ${matchday.spieltagNr}`
	}));

	const matchdayGames = sortGames(
		championship.games.filter(
			(game) =>
				game.eventId === activeMatchday?.id ||
				game.eventId === activeMatchday?.eventId
		)
	);

	const rows: ChampionshipGameRow[] = matchdayGames.map((game) => ({
		...game,
		objectId: game.id
	}));

	const saveGameScore = async (
		gameId: string,
		score1: number | null | undefined,
		score2: number | null | undefined
	) => {
		const current = championship.games.find((game) => game.id === gameId);
		if (!current) {
			return;
		}
		const labels = getTeamLabel(
			current,
			championship.games,
			championship.groups,
			championship.signups,
			related.clubs
		);
		const nextGame: ChampionshipGame = {
			...current,
			score1,
			score2,
			...winnerLoserFromScores(
				current,
				score1,
				score2,
				labels.team1.signupId,
				labels.team2.signupId
			)
		};
		const games = championship.games.map((game) =>
			game.id === gameId ? nextGame : game
		);
		const groups = recalcChampionshipStandings({
			groups: championship.groups,
			games,
			signups: championship.signups,
			clubs: related.clubs
		});
		await onUpdate({ games, groups }, "Ergebnis gespeichert");
	};

	const columns: ColumnDef<ChampionshipGameRow>[] = useMemo(
		() => [
			{
				accessorFn: (row) => row.gameNr,
				header: () => <span>Nr.</span>,
				id: "gameNr",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => `${row.pass} / ${row.field}`,
				header: () => <span>DG / Feld</span>,
				id: "slot",
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
						related.clubs,
						championship.show_class
					).team1.label,
				header: () => <span>Team 1</span>,
				id: "team1",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				accessorFn: (row) => (
					<ChampionshipScoreCell
						game={row}
						disabled={loading}
						onChange={({ score1, score2 }) =>
							saveGameScore(row.id, score1, score2)
						}
					/>
				),
				header: () => <span>Ergebnis</span>,
				id: "score",
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
						related.clubs,
						championship.show_class
					).team2.label,
				header: () => <span>Team 2</span>,
				id: "team2",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			}
		],
		[
			championship.games,
			championship.groups,
			championship.show_class,
			championship.signups,
			loading,
			related.clubs
		]
	);

	if (sortedMatchdays.length === 0) {
		return <p>Bitte zuerst Spieltage anlegen.</p>;
	}

	return (
		<div className="flex col a-st gap-sm">
			<Select
				id="resultsMatchday"
				label="Spieltag"
				options={matchdayOptions}
				value={
					matchdayOptions.find(
						(option) => option.value === activeMatchday?.id
					) || null
				}
				onChange={(option) => setMatchdayId(selectString(option))}
			/>
			<Table columns={columns} data={rows} />
		</div>
	);
};

export default Results;
