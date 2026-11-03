"use client";

import { FC, useMemo, useState } from "react";
import { CreateButton, SwitchButtons, usePageData } from "@repo/ui";
import { ChampionshipGame } from "@repo/types";
import { useAppContext } from "@repo/provider";
import { ChampionshipPageModel, ChampionshipTabProps } from "../../../types";
import useDivisionCategories from "../../../../hooks/useDivisionCategories";
import { createGame } from "../../../functions/signups";
import GameEditSlideIn from "./components/GameEditSlideIn";
import GenerateGamesSlideIn from "./components/GenerateGamesSlideIn";
import GamesTable from "./components/GamesTable";
import ScheduleWorkspace from "./components/ScheduleWorkspace";

type GameFilter = { value: string; label: string };

const views: GameFilter[] = [
	{ value: "board", label: "Spielplan" },
	{ value: "table", label: "Tabelle" }
];

const Games: FC<ChampionshipTabProps> = ({ related }) => {
	const { project } = useAppContext();
	const divisions = useDivisionCategories(project?.objectId);
	const { data: page, setData } = usePageData<ChampionshipPageModel>();
	const [view, setView] = useState("board");
	const [filter, setFilter] = useState<GameFilter>({
		value: "all",
		label: "Alle"
	});
	const [matchDayId, setMatchDayId] = useState("");
	const [editGame, setEditGame] = useState<ChampionshipGame | null>(null);
	const [generate, setGenerate] = useState(false);
	const games = page?.data.games || [];
	const groups = page?.data.groups || [];

	const matchDays = useMemo(
		() =>
			[...(page?.data.match_days || [])].sort(
				(a, b) => a.number - b.number
			),
		[page?.data.match_days]
	);
	const matchDayButtons = matchDays.map((item) => ({
		value: item.id,
		label: `Spieltag ${item.number}`
	}));
	const activeMatchDayId = matchDays.some((item) => item.id === matchDayId)
		? matchDayId
		: matchDays[0]?.id || "";

	const filters = useMemo(() => {
		const buttons: GameFilter[] = [{ value: "all", label: "Alle" }];
		groups.forEach((group) => {
			buttons.push({ value: group.id, label: group.name || "Gruppe" });
		});
		if (page?.settings.ak_games) {
			buttons.push({ value: "akk", label: "Außer Konkurrenz" });
		}
		return buttons;
	}, [groups, page?.settings.ak_games]);

	const visible = games
		.filter((game) => {
			if (filter.value === "all") return true;
			if (filter.value === "akk") return game.type === "akk";
			return game.group_id === filter.value;
		})
		.sort((a, b) => a.game_nr - b.game_nr);

	if (!page) return null;

	const saveGame = (game: ChampionshipGame) => {
		const exists = page.data.games.some((item) => item.id === game.id);
		setData(
			"data.games",
			exists
				? page.data.games.map((item) =>
						item.id === game.id ? game : item
					)
				: [...page.data.games, game]
		);
		setEditGame(null);
	};

	const newGame = (partial: Partial<ChampionshipGame>) =>
		setEditGame(
			createGame({
				game_nr:
					games.reduce(
						(max, game) => Math.max(max, game.game_nr || 0),
						0
					) + 1,
				group_id: groups[0]?.id,
				type: "grp",
				...partial
			})
		);

	const addGame = () => {
		if (view === "board") {
			const nextPass =
				games
					.filter((game) => game.match_day_id === activeMatchDayId)
					.reduce((max, game) => Math.max(max, game.pass || 0), 0) +
				1;
			newGame({ match_day_id: activeMatchDayId, pass: nextPass });
			return;
		}
		const groupFilter = filter.value !== "all" && filter.value !== "akk";
		newGame({
			match_day_id: page.data.match_days[0]?.id,
			group_id: groupFilter ? String(filter.value) : groups[0]?.id,
			type: filter.value === "akk" ? "akk" : "grp"
		});
	};

	return (
		<div className="flex col a-st gap-sm" style={{ width: "100%" }}>
			<div className="flex row a-ce gap-sm" style={{ flexWrap: "wrap" }}>
				<button
					type="button"
					className="full_button sm"
					onClick={() => setGenerate(true)}
				>
					Spiele generieren
				</button>
				<CreateButton
					text="Spiel hinzufügen"
					size="small"
					onClick={addGame}
				/>
				<SwitchButtons
					buttonStates={views}
					currentStates={views.find((item) => item.value === view)}
					changeHandler={(state) => setView(String(state.value))}
				/>
			</div>
			{view === "board" ? (
				matchDays.length === 0 ? (
					<p>Lege zuerst einen Spieltag an.</p>
				) : (
					<>
						{matchDays.length > 1 ? (
							<SwitchButtons
								buttonStates={matchDayButtons}
								currentStates={matchDayButtons.find(
									(item) => item.value === activeMatchDayId
								)}
								changeHandler={(state) =>
									setMatchDayId(String(state.value))
								}
							/>
						) : null}
						<ScheduleWorkspace
							key={activeMatchDayId}
							page={page}
							matchDayId={activeMatchDayId}
							clubs={related.clubs}
							divisions={divisions}
							onChangeGames={(next) =>
								setData("data.games", next)
							}
							onMaxConsecutiveChange={(value) =>
								setData(
									"settings.max_consecutive_passes",
									value
								)
							}
							onEdit={setEditGame}
							onCreate={(pass, field) =>
								newGame({
									match_day_id: activeMatchDayId,
									pass,
									field
								})
							}
						/>
					</>
				)
			) : (
				<>
					<SwitchButtons
						buttonStates={filters}
						currentStates={
							filters.find(
								(item) => item.value === filter.value
							) || filters[0]
						}
						changeHandler={(state) =>
							setFilter({
								value: String(state.value),
								label: state.label
							})
						}
					/>
					<GamesTable
						page={page}
						games={visible}
						clubs={related.clubs}
						divisions={divisions}
						onEdit={setEditGame}
						onDelete={(game) =>
							setData(
								"data.games",
								page.data.games.filter(
									(item) => item.id !== game.id
								)
							)
						}
					/>
				</>
			)}
			<GameEditSlideIn
				isOpen={Boolean(editGame)}
				game={editGame}
				groups={page.data.groups}
				games={page.data.games}
				matchDays={page.data.match_days}
				signups={page.data.sign_ups}
				clubs={related.clubs}
				onClose={() => setEditGame(null)}
				onSave={saveGame}
			/>
			<GenerateGamesSlideIn
				isOpen={generate}
				page={page}
				clubs={related.clubs}
				onClose={() => setGenerate(false)}
				onApply={(nextGames) => {
					setData("data.games", nextGames);
					setGenerate(false);
				}}
			/>
		</div>
	);
};

export default Games;
