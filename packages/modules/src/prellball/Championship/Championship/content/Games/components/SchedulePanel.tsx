"use client";

import { FC, useState } from "react";
import { CircleCheck, CircleX, TriangleAlert } from "lucide-react";
import { ScheduleState } from "../hooks/useSchedule";
import { MoveSuggestion, ScheduleIssueKind } from "../types";
import {
	gameNumber,
	issueMessage,
	participantLabel,
	prerequisiteLabel
} from "../functions/labels";
import { errorCount } from "../functions/validateSchedule";
import { championshipGameTypes } from "../constants/gameTypes";
import styles from "../games.module.scss";

const checks: { kinds: ScheduleIssueKind[]; label: string }[] = [
	{ kinds: ["team_double"], label: "Keine Mannschaft doppelt im Durchgang" },
	{
		kinds: ["referee_double"],
		label: "Schiedsrichter nur einmal je Durchgang"
	},
	{
		kinds: ["field_double", "field_range"],
		label: "Jedes Feld nur einmal belegt"
	},
	{
		kinds: ["dependency"],
		label: "Kreuz- und Platzierungsspiele erst nach ihren Voraussetzungen"
	}
];

const SchedulePanel: FC<{
	schedule: ScheduleState;
	selectedGameId: string | null;
	message: string;
	onSelectGame: (gameId: string, participant?: string) => void;
	onMaxConsecutiveChange: (value: number) => void;
	onApplySuggestion: (suggestion: MoveSuggestion) => void;
	onToggleLock: (gameId: string) => void;
	onEdit: (gameId: string) => void;
	onOptimize: (fromPass: number) => void;
	onAssignReferees: () => void;
	onRenumber: () => void;
}> = ({
	schedule,
	selectedGameId,
	message,
	onSelectGame,
	onMaxConsecutiveChange,
	onApplySuggestion,
	onToggleLock,
	onEdit,
	onOptimize,
	onAssignReferees,
	onRenumber
}) => {
	const { analysis, model, options, labelContext, placements, matchDay } =
		schedule;
	const [fromPass, setFromPass] = useState(1);
	const errors = errorCount(analysis);
	const warnings = analysis.issues.length - errors;
	const streaks = analysis.issues.filter((issue) => issue.kind === "streak");
	const planned = matchDay?.passes || 0;
	const selected = selectedGameId ? model.byId[selectedGameId] : undefined;
	const selectedAt = selectedGameId ? placements[selectedGameId] : undefined;
	const selectedIssues = analysis.issues.filter((issue) =>
		selectedGameId ? issue.gameIds.includes(selectedGameId) : false
	);
	const text = (issue: (typeof analysis.issues)[number]) =>
		issueMessage(
			issue,
			labelContext,
			model.participants,
			options.maxConsecutive
		);

	return (
		<>
			<div className={styles.section}>
				<div className={styles.sectionHeader}>
					<h3>Prüfung</h3>
					<span
						className={styles.chip}
						data-tone={
							errors ? "error" : warnings ? "warning" : undefined
						}
					>
						{errors === 0 && warnings === 0
							? "Alles gültig"
							: `${errors} Fehler · ${warnings} Hinweise`}
					</span>
				</div>
				{checks.map((check) => {
					const count = analysis.issues.filter((issue) =>
						check.kinds.includes(issue.kind)
					).length;
					return (
						<div
							key={check.label}
							className={styles.check}
							data-ok={count === 0}
						>
							{count === 0 ? (
								<CircleCheck size={14} />
							) : (
								<CircleX size={14} />
							)}
							<span>
								{check.label}
								{count > 0 ? ` (${count})` : ""}
							</span>
						</div>
					);
				})}
				<div
					className={styles.check}
					data-ok="true"
					data-warning={streaks.length > 0}
				>
					{streaks.length === 0 ? (
						<CircleCheck size={14} />
					) : (
						<TriangleAlert size={14} />
					)}
					<span className={styles.row}>
						Höchstens
						<input
							type="number"
							min={1}
							value={options.maxConsecutive}
							onChange={(event) =>
								onMaxConsecutiveChange(
									Math.max(1, Number(event.target.value) || 1)
								)
							}
						/>
						Durchgänge in Folge
						{streaks.length > 0 ? ` (${streaks.length})` : ""}
					</span>
				</div>
				<div
					className={styles.check}
					data-ok="true"
					data-warning={planned > 0 && analysis.lastPass > planned}
				>
					{planned > 0 && analysis.lastPass > planned ? (
						<TriangleAlert size={14} />
					) : (
						<CircleCheck size={14} />
					)}
					<span>
						{analysis.lastPass} Durchgänge
						{planned ? ` (geplant ${planned})` : ""} ·{" "}
						{model.games.length} Spiele auf {options.fields} Feldern
					</span>
				</div>
				{analysis.issues.length > 0 ? (
					<div className={styles.issueList}>
						{analysis.issues.map((issue) => (
							<button
								key={issue.id}
								type="button"
								className={styles.issue}
								data-severity={issue.severity}
								data-kind={issue.kind}
								onClick={() => {
									const gameId = issue.gameIds[0];
									if (gameId)
										onSelectGame(gameId, issue.participant);
								}}
							>
								{text(issue)}
							</button>
						))}
					</div>
				) : null}
			</div>

			<div className={styles.section}>
				{selected && selectedAt ? (
					<>
						<div className={styles.sectionHeader}>
							<h3>Spiel {selected.game_nr}</h3>
							<span
								className={styles.chip}
								data-tone={
									analysis.gameStatus[selected.id] === "ok"
										? undefined
										: analysis.gameStatus[selected.id]
								}
							>
								{championshipGameTypes.find(
									(item) => item.value === selected.type
								)?.label || selected.type}
							</span>
						</div>
						<dl className={styles.details}>
							<dt>Durchgang</dt>
							<dd>{selectedAt.pass}</dd>
							<dt>Feld</dt>
							<dd>{selectedAt.field}</dd>
							<dt>Spiel</dt>
							<dd>
								{selected.players
									.map((player) =>
										participantLabel(player, labelContext)
									)
									.join(" – ") || "—"}
							</dd>
							<dt>SR</dt>
							<dd>
								{participantLabel(
									selected.referee,
									labelContext
								)}
							</dd>
							{selected.prerequisites.length > 0 ? (
								<>
									<dt>Benötigt</dt>
									<dd>
										{selected.prerequisites
											.map((item) =>
												prerequisiteLabel(
													item,
													labelContext
												)
											)
											.join(", ")}
									</dd>
								</>
							) : null}
						</dl>
						{selectedIssues.map((issue) => (
							<p
								key={issue.id}
								className={styles.issue}
								data-severity={issue.severity}
								data-kind={issue.kind}
							>
								{text(issue)}
							</p>
						))}
						{selected.locked ? (
							<p className={styles.muted}>
								Gesperrt – wird beim Optimieren nicht
								verschoben.
							</p>
						) : schedule.suggestions.length > 0 ? (
							<>
								<strong>Vorschläge</strong>
								{schedule.suggestions.map(
									(suggestion, index) => (
										<div
											key={`${suggestion.pass}:${suggestion.field}`}
											className={styles.suggestion}
											data-recommended={index === 0}
										>
											<span>
												{suggestion.kind === "swap" &&
												suggestion.otherGameId
													? `Mit ${gameNumber(suggestion.otherGameId, labelContext)} tauschen`
													: "Verschieben"}{" "}
												nach Dg. {suggestion.pass}, Feld{" "}
												{suggestion.field}
												{index === 0
													? " · empfohlen"
													: ""}
											</span>
											<button
												type="button"
												className="full_button sm light"
												onClick={() =>
													onApplySuggestion(
														suggestion
													)
												}
											>
												Anwenden
											</button>
										</div>
									)
								)}
							</>
						) : (
							<p className={styles.muted}>
								{selectedIssues.length > 0
									? "Kein einzelner Zug verbessert den Plan. Optimiere einen Bereich von Durchgängen."
									: "Das Spiel ist gültig eingeplant."}
							</p>
						)}
						<div className={styles.row}>
							<button
								type="button"
								className="full_button sm light"
								onClick={() => onEdit(selected.id)}
							>
								Bearbeiten
							</button>
							<button
								type="button"
								className="full_button sm light"
								onClick={() => onToggleLock(selected.id)}
							>
								{selected.locked ? "Entsperren" : "Sperren"}
							</button>
						</div>
					</>
				) : (
					<>
						<h3>Spiel verschieben</h3>
						<p className={styles.muted}>
							Spiel anklicken oder per Drag & Drop ziehen. Grüne
							Felder verbessern den Plan, blaue sind zulässig,
							rote verletzen eine Regel. Ein belegtes Feld tauscht
							die Spiele.
						</p>
					</>
				)}
			</div>

			<div className={styles.section}>
				<h3>Optimieren (Coming Soon)</h3>
				<p className={styles.muted}>
					Erst werden harte Regeln erfüllt, dann Pausen verbessert.
					Gesperrte Spiele bleiben stehen.
				</p>
				<button
					type="button"
					className="full_button sm"
					onClick={() => onOptimize(1)}
					disabled
				>
					Spieltag neu verteilen
				</button>
				<div className={styles.row}>
					<span>Ab Dg.</span>
					<input
						type="number"
						min={1}
						value={fromPass}
						disabled
						onChange={(event) =>
							setFromPass(
								Math.max(1, Number(event.target.value) || 1)
							)
						}
					/>
					<button
						type="button"
						className="full_button sm light"
						onClick={() => onOptimize(fromPass)}
						disabled
					>
						neu berechnen
					</button>
				</div>
				<div className={styles.row}>
					<button
						type="button"
						className="full_button sm light"
						onClick={onAssignReferees}
						disabled
					>
						Schiedsrichter zuweisen
					</button>
					<button
						type="button"
						className="full_button sm light"
						onClick={onRenumber}
						disabled
					>
						Spielnummern nach Plan
					</button>
				</div>
				{message ? <p className={styles.muted}>{message}</p> : null}
			</div>
		</>
	);
};

export default SchedulePanel;
