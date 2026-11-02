"use client";

import { FC, Fragment, useMemo } from "react";
import { ScheduleState } from "../hooks/useSchedule";
import { MatrixCell, MatrixRow, ParticipantKind } from "../types";
import { participantLabel } from "../functions/labels";
import styles from "../games.module.scss";

const sections: { kind: ParticipantKind; label: string }[] = [
	{ kind: "team", label: "Mannschaften" },
	{
		kind: "place",
		label: "Platzierungen (stehen erst nach der Gruppe fest)"
	},
	{ kind: "game", label: "Sieger / Verlierer" }
];

const cellText = (cell?: MatrixCell) => {
	if (!cell) return "–";
	if (cell.gameIds.length > 1) return `${cell.gameIds.length}×`;
	return cell.roles[0] === "referee" ? "SR" : "S";
};

const legend = [
	{ tone: "ok", label: "S = spielt" },
	{ tone: "referee", label: "SR = pfeift" },
	{ tone: "tight", label: "Serie am Limit" },
	{ tone: "streak", label: "Serie zu lang" },
	{ tone: "blocked", label: "Voraussetzung fehlt" },
	{ tone: "double", label: "Doppelt eingeteilt" }
];

const TeamMatrix: FC<{
	schedule: ScheduleState;
	focusKey: string | null;
	selectedGameId: string | null;
	onFocus: (key: string | null) => void;
	onSelectGame: (gameId: string) => void;
}> = ({ schedule, focusKey, selectedGameId, onFocus, onSelectGame }) => {
	const { analysis, model, labelContext } = schedule;
	const passes = Array.from(
		{ length: Math.max(1, schedule.passes - 1) },
		(_, i) => i + 1
	);

	const order = useMemo(() => {
		const position: Record<string, number> = {};
		let counter = 0;
		labelContext.groups.forEach((group) => {
			group.subgroups.forEach((subgroup) => {
				position[subgroup.id] = counter;
				counter += 1;
			});
		});
		return (row: MatrixRow) => {
			const participant = model.participants[row.key];
			return (
				(position[participant?.subgroupId || ""] ?? 999) * 100 +
				(participant?.index || 0)
			);
		};
	}, [labelContext.groups, model.participants]);

	const label = (key: string) =>
		participantLabel(model.participants[key], labelContext);

	return (
		<div className="flex col a-st gap-sm" style={{ width: "100%" }}>
			<div className={styles.sectionHeader} style={{ width: "100%" }}>
				<div className={styles.legend}>
					{legend.map((item) => (
						<span key={item.tone} className={styles.legendItem}>
							<span
								className={styles.swatch}
								data-tone={item.tone}
							/>
							{item.label}
						</span>
					))}
				</div>
				<select
					value={focusKey || ""}
					onChange={(event) => onFocus(event.target.value || null)}
				>
					<option value="">Alle Mannschaften</option>
					{analysis.rows
						.filter(
							(row) =>
								model.participants[row.key]?.kind === "team"
						)
						.sort((a, b) => order(a) - order(b))
						.map((row) => (
							<option key={row.key} value={row.key}>
								{label(row.key)}
							</option>
						))}
				</select>
			</div>
			<div className={styles.scroll}>
				<table className={styles.matrix}>
					<thead>
						<tr>
							<th style={{ textAlign: "left" }}>Mannschaft</th>
							{passes.map((pass) => (
								<th key={pass}>{pass}</th>
							))}
							<th title="Spiele">Sp.</th>
							<th title="Schiedsrichtereinsätze">SR</th>
							<th title="Längste Serie ohne Pause">Serie</th>
						</tr>
					</thead>
					<tbody>
						{sections.map((section) => {
							const rows = analysis.rows
								.filter(
									(row) =>
										model.participants[row.key]?.kind ===
										section.kind
								)
								.sort((a, b) => order(a) - order(b));
							if (rows.length === 0) return null;
							return (
								<Fragment key={section.kind}>
									<tr className={styles.matrixGroup}>
										<td colSpan={passes.length + 4}>
											{section.label}
										</td>
									</tr>
									{rows.map((row) => {
										const dimmed =
											Boolean(focusKey) &&
											focusKey !== row.key;
										return (
											<tr key={row.key}>
												<td
													className={
														styles.matrixLabel
													}
													data-focus={
														focusKey === row.key
													}
													title={label(row.key)}
													onClick={() =>
														onFocus(
															focusKey === row.key
																? null
																: row.key
														)
													}
												>
													{label(row.key)}
												</td>
												{passes.map((pass) => {
													const cell =
														row.cells[pass];
													return (
														<td
															key={pass}
															className={
																styles.matrixCell
															}
															data-role={
																cell?.roles[0]
															}
															data-status={
																cell &&
																cell.status !==
																	"ok"
																	? cell.status
																	: undefined
															}
															data-selected={Boolean(
																selectedGameId &&
																cell?.gameIds.includes(
																	selectedGameId
																)
															)}
															data-dimmed={dimmed}
															onClick={() => {
																onFocus(
																	row.key
																);
																const gameId =
																	cell
																		?.gameIds[0];
																if (gameId)
																	onSelectGame(
																		gameId
																	);
															}}
														>
															{cellText(cell)}
														</td>
													);
												})}
												<td>{row.played}</td>
												<td>{row.refereed}</td>
												<td>{row.longestStreak}</td>
											</tr>
										);
									})}
								</Fragment>
							);
						})}
					</tbody>
				</table>
			</div>
			<p className={styles.muted}>
				Die Matrix wird aus dem Spielplan abgeleitet. Klick auf eine
				Mannschaft hebt ihre Spiele im Spielplan hervor.
			</p>
		</div>
	);
};

export default TeamMatrix;
