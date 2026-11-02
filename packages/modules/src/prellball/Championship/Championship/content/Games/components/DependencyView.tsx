"use client";

import { FC } from "react";
import { ScheduleState } from "../hooks/useSchedule";
import { GamePrerequisite } from "../types";
import { prerequisiteLabel, subgroupName } from "../functions/labels";
import { championshipGameTypes } from "../constants/gameTypes";
import styles from "../games.module.scss";

const DependencyView: FC<{
	schedule: ScheduleState;
	selectedGameId: string | null;
	onSelectGame: (gameId: string) => void;
}> = ({ schedule, selectedGameId, onSelectGame }) => {
	const { model, placements, analysis, labelContext } = schedule;

	const passOf = (id: string) => placements[id]?.pass ?? 0;
	const finishedAfter = (prerequisite: GamePrerequisite) => {
		const ids =
			prerequisite.kind === "game"
				? [prerequisite.gameId]
				: prerequisite.gameIds;
		return Math.max(0, ...ids.map(passOf));
	};

	const phases: Record<string, string[]> = {};
	model.games.forEach((game) => {
		if (game.type !== "grp") return;
		game.players.forEach((player) => {
			if (!player.subgroupId) return;
			const list = phases[player.subgroupId] || [];
			if (!list.includes(game.id)) list.push(game.id);
			phases[player.subgroupId] = list;
		});
	});

	const dependents = model.games
		.filter((game) => game.prerequisites.length > 0)
		.sort((a, b) => passOf(a.id) - passOf(b.id) || a.game_nr - b.game_nr);

	return (
		<div className="flex col a-st gap-sm" style={{ width: "100%" }}>
			<h3>Gruppenphasen</h3>
			{Object.keys(phases).length === 0 ? (
				<p className={styles.muted}>
					An diesem Spieltag gibt es keine Gruppenspiele.
				</p>
			) : (
				<div className={styles.phases}>
					{Object.entries(phases).map(([subgroupId, ids]) => {
						const passes = ids.map(passOf);
						return (
							<div key={subgroupId} className={styles.phase}>
								<strong>
									{subgroupName(subgroupId, labelContext)}
								</strong>
								<span>
									{ids.length} Spiele · Dg.{" "}
									{Math.min(...passes)}–{Math.max(...passes)}
								</span>
								<span className={styles.muted}>
									Abgeschlossen nach Dg. {Math.max(...passes)}
								</span>
							</div>
						);
					})}
				</div>
			)}
			<h3>Abhängige Spiele</h3>
			{dependents.length === 0 ? (
				<p className={styles.muted}>
					Keine Spiele warten auf Gruppen oder andere Ergebnisse.
				</p>
			) : (
				<div className="flex col a-st gap-sm" style={{ width: "100%" }}>
					{dependents.map((game) => {
						const pass = passOf(game.id);
						const earliest =
							Math.max(
								0,
								...game.prerequisites.map(finishedAfter)
							) + 1;
						const blocked =
							analysis.gameStatus[game.id] === "blocked";
						const type = championshipGameTypes.find(
							(item) => item.value === game.type
						);
						return (
							<div
								key={game.id}
								className={styles.dependency}
								style={{ width: "100%" }}
								data-status={blocked ? "blocked" : "ok"}
								data-selected={game.id === selectedGameId}
								onClick={() => onSelectGame(game.id)}
							>
								<span>
									<strong>Sp. {game.game_nr}</strong> ·{" "}
									{type?.short || game.type} · Dg. {pass}
								</span>
								<span
									className="flex row a-ce gap-sm"
									style={{ flexWrap: "wrap" }}
								>
									{game.prerequisites.map((prerequisite) => {
										const after =
											finishedAfter(prerequisite);
										const ok = after < pass;
										return (
											<span
												key={
													prerequisite.kind === "game"
														? prerequisite.gameId
														: prerequisite.subgroupId
												}
												className={styles.chip}
												data-tone={
													ok ? undefined : "blocked"
												}
											>
												{prerequisiteLabel(
													prerequisite,
													labelContext
												)}
												{" · "}
												{ok
													? `fertig nach Dg. ${after}`
													: `erst in Dg. ${after}`}
											</span>
										);
									})}
								</span>
								<span
									className={styles.chip}
									data-tone={blocked ? "blocked" : undefined}
								>
									{blocked
										? `frühestens Dg. ${earliest}`
										: "bereit"}
								</span>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default DependencyView;
