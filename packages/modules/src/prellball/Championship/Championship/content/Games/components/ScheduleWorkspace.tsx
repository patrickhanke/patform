"use client";

import { FC, useState } from "react";
import { SwitchButtons } from "@repo/ui";
import { ChampionshipGame, ClubClass } from "@repo/types";
import { ChampionshipPageModel } from "../../../../types";
import { DivisionCategory } from "../../../../../functions/divisions";
import useSchedule from "../hooks/useSchedule";
import { withPlacements } from "../functions/scheduleModel";
import { analyzeSchedule, errorCount } from "../functions/validateSchedule";
import {
	assignReferees,
	moveInPlacements,
	renumberGames,
	scheduleGames
} from "../functions/optimizeSchedule";
import ScheduleBoard from "./ScheduleBoard";
import TeamMatrix from "./TeamMatrix";
import DependencyView from "./DependencyView";
import SchedulePanel from "./SchedulePanel";
import styles from "../games.module.scss";

const tabs = [
	{ value: "matrix", label: "Mannschaften" },
	{ value: "dependencies", label: "Abhängigkeiten" }
];

const ScheduleWorkspace: FC<{
	page: ChampionshipPageModel;
	matchDayId: string;
	clubs: ClubClass[];
	divisions: DivisionCategory[];
	onChangeGames: (games: ChampionshipGame[]) => void;
	onMaxConsecutiveChange: (value: number) => void;
	onEdit: (game: ChampionshipGame) => void;
	onCreate: (pass: number, field: number) => void;
}> = ({
	page,
	matchDayId,
	clubs,
	divisions,
	onChangeGames,
	onMaxConsecutiveChange,
	onEdit,
	onCreate
}) => {
	const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
	const [focusKey, setFocusKey] = useState<string | null>(null);
	const [tab, setTab] = useState(tabs[0]?.value || "matrix");
	const [message, setMessage] = useState("");
	const schedule = useSchedule({
		page,
		matchDayId,
		clubs,
		divisions,
		selectedGameId
	});
	const { dayGames, model, placements, options, analysis } = schedule;

	const replaceDay = (next: ChampionshipGame[]) => {
		const byId = Object.fromEntries(next.map((game) => [game.id, game]));
		onChangeGames(page.data.games.map((game) => byId[game.id] || game));
	};

	const move = (gameId: string, pass: number, field: number) => {
		if (model.byId[gameId]?.locked) {
			setMessage("Gesperrte Spiele werden nicht verschoben.");
			return;
		}
		const moved = moveInPlacements(model, placements, gameId, pass, field);
		if (!moved) {
			setMessage(
				"Mit einem gesperrten Spiel kann nicht getauscht werden."
			);
			return;
		}
		setMessage("");
		replaceDay(withPlacements(dayGames, moved.placements));
	};

	const optimize = (fromPass: number) => {
		const next = scheduleGames(model, placements, options, fromPass);
		const after = analyzeSchedule(model, next, options);
		if (after.score >= analysis.score) {
			setMessage(
				"Keine Verbesserung gefunden. Der Plan bleibt unverändert."
			);
			return;
		}
		const moved = model.games.filter((game) => {
			const before = placements[game.id];
			const now = next[game.id];
			return before?.pass !== now?.pass || before?.field !== now?.field;
		}).length;
		setMessage(
			`${moved} Spiele verschoben · Fehler ${errorCount(analysis)} → ${errorCount(after)} · ${after.lastPass} Durchgänge`
		);
		replaceDay(withPlacements(dayGames, next));
	};

	const toggleLock = (gameId: string) =>
		replaceDay(
			dayGames.map((game) =>
				game.id === gameId ? { ...game, locked: !game.locked } : game
			)
		);

	const editGame = (gameId: string) => {
		const game = dayGames.find((item) => item.id === gameId);
		if (game) onEdit(game);
	};

	const selectGame = (gameId: string | null, participant?: string) => {
		setSelectedGameId(gameId);
		if (participant) setFocusKey(participant);
	};

	if (dayGames.length === 0) {
		return (
			<div className={styles.section} style={{ width: "100%" }}>
				<p>
					Für diesen Spieltag gibt es noch keine Spiele. Erzeuge sie
					über „Spiele generieren“ oder lege sie einzeln an.
				</p>
			</div>
		);
	}

	return (
		<div className={styles.workspace}>
			<div className={styles.main}>
				<div className={styles.section}>
					<div className={styles.sectionHeader}>
						<h3>Spielplan</h3>
						<span className={styles.muted}>
							Durchgänge × Felder · Doppelklick auf ein Spiel zum
							Bearbeiten, auf ein leeres Feld zum Anlegen
						</span>
					</div>
					<ScheduleBoard
						schedule={schedule}
						selectedGameId={selectedGameId}
						focusKey={focusKey}
						onSelect={(gameId) => selectGame(gameId)}
						onMove={move}
						onToggleLock={toggleLock}
						onEdit={editGame}
						onCreate={onCreate}
					/>
				</div>
				<div className={styles.section}>
					<SwitchButtons
						buttonStates={tabs}
						currentStates={tabs.find((item) => item.value === tab)}
						changeHandler={(state) => setTab(String(state.value))}
					/>
					{tab === "matrix" ? (
						<TeamMatrix
							schedule={schedule}
							focusKey={focusKey}
							selectedGameId={selectedGameId}
							onFocus={setFocusKey}
							onSelectGame={(gameId) => selectGame(gameId)}
						/>
					) : (
						<DependencyView
							schedule={schedule}
							selectedGameId={selectedGameId}
							onSelectGame={(gameId) => selectGame(gameId)}
						/>
					)}
				</div>
			</div>
			<div className={styles.side}>
				<SchedulePanel
					schedule={schedule}
					selectedGameId={selectedGameId}
					message={message}
					onSelectGame={selectGame}
					onMaxConsecutiveChange={onMaxConsecutiveChange}
					onApplySuggestion={(suggestion) =>
						move(
							suggestion.gameId,
							suggestion.pass,
							suggestion.field
						)
					}
					onToggleLock={toggleLock}
					onEdit={editGame}
					onOptimize={optimize}
					onAssignReferees={() => {
						const next = assignReferees(
							model,
							dayGames,
							placements
						);
						const count = next.filter(
							(game, index) => game !== dayGames[index]
						).length;
						setMessage(
							count
								? `${count} Schiedsrichter zugewiesen.`
								: "Alle Spiele haben bereits Schiedsrichter oder es ist kein Team frei."
						);
						if (count) replaceDay(next);
					}}
					onRenumber={() => {
						replaceDay(renumberGames(dayGames));
						setMessage(
							"Spielnummern folgen jetzt Durchgang und Feld."
						);
					}}
				/>
			</div>
		</div>
	);
};

export default ScheduleWorkspace;
