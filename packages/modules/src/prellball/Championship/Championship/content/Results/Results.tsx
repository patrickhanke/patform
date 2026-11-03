"use client";

import { FC, useMemo, useState } from "react";
import {
	ColumnDef,
	IconButton,
	SwitchButtons,
	Table,
	usePageData
} from "@repo/ui";
import { ChampionshipGame } from "@repo/types";
import {
	useAppContext,
	useSeasonCategories,
	seasonCategoryId,
	seasonCategoryTitle,
	divisionShort,
	useDivisionCategories
} from "@repo/provider";
import { ChampionshipPageModel, ChampionshipTabProps } from "../../../types";
import DeciderSlideIn from "./content/DeciderSlideIn";
import GameCard from "./content/cards/GameCard";
import { ResultSlideIn } from "./content";
import { resolveTeam, withWinner } from "./functions/resolveTeam";
import { calculateGroupStandings } from "./functions/standings";

/**
 * Tab inside the championship page. The page owns loading and saving
 * (`usePageData` with `initialData`); this tab only reads and edits that store.
 */
const Results: FC<ChampionshipTabProps> = ({ related }) => {
	const { project } = useAppContext();
	const seasons = useSeasonCategories(project?.objectId);
	const divisions = useDivisionCategories(project?.objectId);
	const [matchDayId, setMatchDayId] = useState("");
	const [editId, setEditId] = useState("");
	const [decider, setDecider] = useState(false);

	const { data: page, setData } = usePageData<ChampionshipPageModel>();
	const matchDays = [...(page?.data.match_days || [])].sort(
		(a, b) => a.number - b.number
	);
	const activeId = matchDays.some((day) => day.id === matchDayId)
		? matchDayId
		: matchDays[0]?.id || "";
	const games = (page?.data.games || [])
		.filter((game) => game.match_day_id === activeId)
		.sort(
			(a, b) =>
				a.pass - b.pass || a.field - b.field || a.game_nr - b.game_nr
		);

	const matchDayButtons = matchDays.map((day) => ({
		value: day.id,
		label: `Spieltag ${day.number}`
	}));

	const commitGames = (nextGames: ChampionshipGame[]) => {
		if (!page) return;
		let finished = nextGames;
		finished = finished.map((game) =>
			withWinner(game, page.data.groups, finished)
		);
		finished = finished.map((game) =>
			withWinner(game, page.data.groups, finished)
		);
		setData("data", {
			...page.data,
			games: finished,
			groups: calculateGroupStandings(
				page.data.groups,
				finished,
				page.data.sign_ups,
				related.clubs
			)
		});
	};

	const columns: ColumnDef<ChampionshipGame>[] = useMemo(
		() => [
			{
				id: "pass",
				header: () => <span>Durchgang</span>,
				accessorFn: (row) => row.pass,
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				id: "class",
				header: () => <span>Division</span>,
				accessorFn: (row) => {
					if (!page) return "—";
					const left = resolveTeam(
						row,
						"team1",
						page.data.groups,
						page.data.games,
						page.data.sign_ups,
						related.clubs,
						false
					).division;
					const right = resolveTeam(
						row,
						"team2",
						page.data.groups,
						page.data.games,
						page.data.sign_ups,
						related.clubs,
						false
					).division;
					const leftLabel = divisionShort(left, divisions);
					const rightLabel = divisionShort(right, divisions);
					if (!leftLabel && !rightLabel) return "—";
					return leftLabel === rightLabel
						? leftLabel
						: `${leftLabel} / ${rightLabel}`;
				},
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				id: "game_nr",
				header: () => <span>Spiel</span>,
				accessorFn: (row) => row.game_nr,
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				id: "field",
				header: () => <span>Feld</span>,
				accessorFn: (row) => row.field,
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				id: "team1",
				header: () => <span>Mannschaft 1</span>,
				accessorFn: (row) =>
					page
						? resolveTeam(
								row,
								"team1",
								page.data.groups,
								page.data.games,
								page.data.sign_ups,
								related.clubs,
								page.settings.show_division,
								divisions
							).label
						: "—",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				id: "team2",
				header: () => <span>Mannschaft 2</span>,
				accessorFn: (row) =>
					page
						? resolveTeam(
								row,
								"team2",
								page.data.groups,
								page.data.games,
								page.data.sign_ups,
								related.clubs,
								page.settings.show_division,
								divisions
							).label
						: "—",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				id: "referee",
				header: () => <span>Schiedsrichter</span>,
				accessorFn: (row) => {
					if (!page) return "—";
					return resolveTeam(
						row,
						"referee",
						page.data.groups,
						page.data.games,
						page.data.sign_ups,
						related.clubs,
						page.settings.show_division,
						divisions
					).label;
				},
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				id: "half1",
				header: () => <span>Halbzeit 1</span>,
				accessorFn: (row) => row.half1 ?? "—",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				id: "half2",
				header: () => <span>Halbzeit 2</span>,
				accessorFn: (row) => row.half2 ?? "—",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				id: "score1",
				header: () => <span>Ergebnis 1</span>,
				accessorFn: (row) => row.score1 ?? "—",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				id: "score2",
				header: () => <span>Ergebnis 2</span>,
				accessorFn: (row) => row.score2 ?? "—",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id
			},
			{
				id: "edit",
				header: () => <span>Bearbeiten</span>,
				accessorFn: (row) => row.id,
				cell: (info) => (
					<IconButton
						icon="edit"
						onClick={() => setEditId(info.row.original.id)}
					/>
				),
				footer: (info) => info.column.id
			}
		],
		[page, related.clubs, divisions]
	);

	if (!page) return null;

	const edited = page.data.games.find((game) => game.id === editId) || null;
	const leftTeam = edited
		? resolveTeam(
				edited,
				"team1",
				page.data.groups,
				page.data.games,
				page.data.sign_ups,
				related.clubs,
				false
			)
		: undefined;
	const rightTeam = edited
		? resolveTeam(
				edited,
				"team2",
				page.data.groups,
				page.data.games,
				page.data.sign_ups,
				related.clubs,
				false
			)
		: undefined;
	const activeDay = matchDays.find((day) => day.id === activeId);

	return (
		<>
			<div className="flex col a-st gap-sm">
				{matchDays.length > 1 ? (
					<SwitchButtons
						buttonStates={matchDayButtons}
						currentStates={matchDayButtons.find(
							(item) => item.value === activeId
						)}
						changeHandler={(state) =>
							setMatchDayId(String(state.value))
						}
					/>
				) : null}
				<h2>
					{activeDay
						? `Spieltag ${activeDay.number}`
						: "Keine Spieltage"}
				</h2>
				<div className="flex row a-ce j-sb gap-sm">
					<button
						type="button"
						className="full_button sm light"
						onClick={() => window.print()}
					>
						Spielkarten drucken
					</button>
					<button
						type="button"
						className="full_button sm"
						disabled={!activeId}
						onClick={() => setDecider(true)}
					>
						Entscheidungsspiel
					</button>
				</div>
				{matchDays.length === 0 ? (
					<p>
						Für diesen Wettkampf sind noch keine Spieltage angelegt.
					</p>
				) : (
					<Table
						columns={columns}
						data={games}
						rowIdResolver={(row) => (row as ChampionshipGame).id}
					/>
				)}
			</div>
			<ResultSlideIn
				game={edited}
				leftLabel={leftTeam?.label || "—"}
				rightLabel={rightTeam?.label || "—"}
				leftSignup={page.data.sign_ups.find(
					(signup) => signup.id === leftTeam?.signupId
				)}
				rightSignup={page.data.sign_ups.find(
					(signup) => signup.id === rightTeam?.signupId
				)}
				people={related.people}
				drafts={page.person_drafts}
				season={seasonCategoryId(page.categories, seasons)}
				onClose={() => setEditId("")}
				onGame={(game) =>
					commitGames(
						page.data.games.map((item) =>
							item.id === game.id ? game : item
						)
					)
				}
				onPerson={(personId, personData) =>
					setData(`person_drafts.${personId}`, personData)
				}
			/>
			<DeciderSlideIn
				isOpen={decider}
				matchDayId={activeId}
				games={page.data.games}
				groups={page.data.groups}
				signups={page.data.sign_ups}
				clubs={related.clubs}
				onClose={() => setDecider(false)}
				onCreate={(game) => {
					commitGames([...page.data.games, game]);
					setDecider(false);
				}}
			/>
			<GameCard
				games={games}
				title={page.title}
				season={seasonCategoryTitle(page.categories, seasons)}
				ctx={{
					games: page.data.games,
					groups: page.data.groups,
					signups: page.data.sign_ups,
					clubs: related.clubs,
					people: related.people,
					locations: related.locations,
					matchDays: page.data.match_days,
					divisions
				}}
			/>
		</>
	);
};

export default Results;
