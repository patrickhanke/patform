"use client";

import { FC, Fragment, useEffect, useRef, useState } from "react";
import { ScheduleState } from "../hooks/useSchedule";
import { ScheduleModelGame } from "../types";
import GameCard from "./GameCard";
import styles from "../games.module.scss";

const DOUBLE_CLICK_MS = 250;

const involves = (game: ScheduleModelGame, key: string | null) =>
	Boolean(
		key &&
		(game.players.some((player) => player.key === key) ||
			game.referee?.key === key)
	);

const ScheduleBoard: FC<{
	schedule: ScheduleState;
	selectedGameId: string | null;
	focusKey: string | null;
	onSelect: (gameId: string | null) => void;
	onMove: (gameId: string, pass: number, field: number) => void;
	onToggleLock: (gameId: string) => void;
	onEdit: (gameId: string) => void;
	onCreate: (pass: number, field: number) => void;
}> = ({
	schedule,
	selectedGameId,
	focusKey,
	onSelect,
	onMove,
	onToggleLock,
	onEdit,
	onCreate
}) => {
	const { model, placements, analysis, targets, options, matchDay } =
		schedule;
	const [dragging, setDragging] = useState<string | null>(null);
	const [dropCell, setDropCell] = useState<string | null>(null);
	const pendingClick = useRef<ReturnType<typeof setTimeout> | null>(null);
	const clearPendingClick = () => {
		if (pendingClick.current) clearTimeout(pendingClick.current);
		pendingClick.current = null;
	};
	useEffect(() => clearPendingClick, []);

	const byCell: Record<string, ScheduleModelGame[]> = {};
	const unplaced: ScheduleModelGame[] = [];
	model.games.forEach((game) => {
		const at = placements[game.id];
		if (!at || at.pass < 1) {
			unplaced.push(game);
			return;
		}
		const cell = `${at.pass}:${at.field}`;
		byCell[cell] = [...(byCell[cell] || []), game];
	});

	const fields = Array.from({ length: schedule.columns }, (_, i) => i + 1);
	const passes = Array.from({ length: schedule.passes }, (_, i) => i + 1);
	const breaks = Object.fromEntries(
		(matchDay?.breaks || []).map((item) => [item.pass, item.duration])
	);

	const renderCard = (game: ScheduleModelGame) => (
		<GameCard
			key={game.id}
			game={game}
			status={analysis.gameStatus[game.id] || "ok"}
			labelContext={schedule.labelContext}
			selected={game.id === selectedGameId}
			focused={involves(game, focusKey)}
			dimmed={Boolean(focusKey) && !involves(game, focusKey)}
			onSelect={() =>
				onSelect(game.id === selectedGameId ? null : game.id)
			}
			onEdit={() => onEdit(game.id)}
			onToggleLock={() => onToggleLock(game.id)}
			onDragStart={() => {
				setDragging(game.id);
				onSelect(game.id);
			}}
			onDragEnd={() => {
				setDragging(null);
				setDropCell(null);
			}}
		/>
	);

	return (
		<div className={styles.scroll}>
			<table className={styles.board}>
				<thead>
					<tr>
						<th>Dg.</th>
						{fields.map((field) => (
							<th key={field}>
								Feld {field}
								{field > options.fields ? " (fehlt)" : ""}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{unplaced.length > 0 ? (
						<tr>
							<td className={styles.passHeader}>
								–<small>ohne Dg.</small>
							</td>
							<td className={styles.cell} colSpan={fields.length}>
								<div className={styles.row}>
									{unplaced.map(renderCard)}
								</div>
							</td>
						</tr>
					) : null}
					{passes.map((pass) => (
						<Fragment key={pass}>
							<tr>
								<td className={styles.passHeader}>
									{pass}
									{matchDay?.passes &&
									pass > matchDay.passes ? (
										<small>zusätzlich</small>
									) : null}
								</td>
								{fields.map((field) => {
									const cell = `${pass}:${field}`;
									const games = byCell[cell] || [];
									const target = selectedGameId
										? targets[cell]
										: undefined;
									const canDrop =
										games.length === 0 ||
										games.every((game) => !game.locked);
									return (
										<td
											key={cell}
											className={styles.cell}
											data-empty={games.length === 0}
											data-target={target}
											data-drop={dropCell === cell}
											data-outside={
												field > options.fields
											}
											onClick={() => {
												if (games.length > 0) return;
												if (
													selectedGameId &&
													(target === "good" ||
														target === "ok")
												) {
													const gameId =
														selectedGameId;
													clearPendingClick();
													pendingClick.current =
														setTimeout(
															() =>
																onMove(
																	gameId,
																	pass,
																	field
																),
															DOUBLE_CLICK_MS
														);
													return;
												}
												onSelect(null);
											}}
											onDoubleClick={() => {
												if (games.length > 0) return;
												clearPendingClick();
												onCreate(pass, field);
											}}
											onDragOver={(event) => {
												if (!dragging || !canDrop)
													return;
												event.preventDefault();
												setDropCell(cell);
											}}
											onDragLeave={() =>
												setDropCell((current) =>
													current === cell
														? null
														: current
												)
											}
											onDrop={(event) => {
												event.preventDefault();
												const id =
													event.dataTransfer.getData(
														"text/plain"
													) || dragging;
												setDragging(null);
												setDropCell(null);
												if (id) onMove(id, pass, field);
											}}
										>
											{games.map(renderCard)}
										</td>
									);
								})}
							</tr>
							{breaks[pass] ? (
								<tr className={styles.breakRow}>
									<td colSpan={fields.length + 1}>
										Pause · {breaks[pass]} Min.
									</td>
								</tr>
							) : null}
						</Fragment>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ScheduleBoard;
