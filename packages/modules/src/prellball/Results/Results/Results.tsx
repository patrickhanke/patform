"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ColumnDef, IconButton, Page, Table, usePageData } from "@repo/ui";
import {
	ChampionshipClass,
	ChampionshipGame,
	PrellballPersonData
} from "@repo/types";
import {
	useAppContext,
	useDataHandlerSecure,
	useGetData
} from "@repo/provider";
import { championshipDetailFields } from "../../Championship/Championship/constants/siteStates";
import { normalizeChampionship } from "../../Championship/functions/normalize";
import { championshipUpdateObject } from "../../Championship/functions/updateObject";
import {
	mergedPersonData,
	readPersonData
} from "../../Championship/functions/person";
import useChampionshipRelated from "../../Championship/Championship/hooks/useChampionshipRelated";
import useSeasonCategories from "../../hooks/useSeasonCategories";
import { seasonCategoryId, seasonCategoryTitle } from "../../functions/season";
import { ChampionshipPageModel } from "../../Championship/types";
import { divisionShort } from "../../functions/divisions";
import useDivisionCategories from "../../hooks/useDivisionCategories";
import { resolveTeam, withWinner } from "../functions/resolveTeam";
import { calculateGroupStandings } from "../functions/standings";
import DeciderSlideIn from "./content/DeciderSlideIn";
import GameCard from "./content/cards/GameCard";
import { ResultSlideIn } from "./content";

const Results = () => {
	const { championship_id: championshipId } = useParams<{
		championship_id: string;
	}>();
	const { project } = useAppContext();
	const seasons = useSeasonCategories(project?.objectId);
	const divisions = useDivisionCategories(project?.objectId);
	const { updateData } = useDataHandlerSecure();
	const related = useChampionshipRelated(project?.objectId);
	const [matchDayId, setMatchDayId] = useState("");
	const [editId, setEditId] = useState("");
	const [decider, setDecider] = useState(false);
	const { data, refetch, error } = useGetData<ChampionshipClass>({
		objectName: "Championship",
		fields: championshipDetailFields,
		id: championshipId
	});
	const championship = useMemo(
		() => normalizeChampionship((data as ChampionshipClass | null) ?? null),
		[data]
	);

	usePageData<ChampionshipPageModel>(
		{
			initialData: championship ?? undefined,
			objectId: championshipId
		},
		{
			className: "Championship",
			message: "Ergebnisse gespeichert",
			updateObject: (page) =>
				championshipUpdateObject({
					...page,
					data: {
						...page.data,
						groups: calculateGroupStandings(
							page.data.groups,
							page.data.games,
							page.data.sign_ups,
							related.clubs
						)
					}
				}),
			afterSave: async (page) => {
				const drafts = Object.entries(page.person_drafts || {});
				if (drafts.length === 0) return;
				await Promise.all(
					drafts.map(([personId, draft], index) => {
						const person = related.people.find(
							(item) => item.objectId === personId
						);
						const nextData: PrellballPersonData = {
							...readPersonData(person),
							...draft
						};
						return updateData({
							className: "Person",
							objectId: personId,
							updateObject: { data: nextData },
							feedback:
								index === 0 ? "Einsätze gespeichert" : undefined
						});
					})
				);
				await related.refetchPeople();
			}
		}
	);

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

	const headerButtons = matchDays.map((day) => ({
		text: `Spieltag ${day.number}`,
		color: day.id === activeId ? "primary" : "light",
		onClick: () => setMatchDayId(day.id)
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
					const referee = related.people.find((item) =>
						(
							mergedPersonData(item, page.person_drafts)
								.referee || []
						).includes(row.id)
					);
					if (referee?.name || referee?.label) {
						return referee.name || referee.label;
					}
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
		[page, related.clubs, related.people, page?.person_drafts, divisions]
	);

	if (!championship || !page) {
		return (
			<Page title="Ergebnisse" emptyContent>
				<p>
					{error
						? "Der Wettkampf konnte nicht geladen werden."
						: "Lädt ..."}
				</p>
			</Page>
		);
	}

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
		<Page
			title={page.title || "Ergebnisse"}
			description={seasonCategoryTitle(page.categories, seasons)}
			emptyContent
			refetch={refetch}
			pageHeaderButtons={headerButtons}
		>
			<div className="flex col a-st gap-sm">
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
		</Page>
	);
};

export default Results;
