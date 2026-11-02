"use client";

import { FC } from "react";
import { Lock, LockOpen } from "lucide-react";
import { ScheduleModelGame, GameStatus, ScheduleLabelContext } from "../types";
import { participantLabel } from "../functions/labels";
import { championshipGameTypes } from "../constants/gameTypes";
import styles from "../games.module.scss";

const GameCard: FC<{
	game: ScheduleModelGame;
	status: GameStatus;
	labelContext: ScheduleLabelContext;
	selected: boolean;
	focused: boolean;
	dimmed: boolean;
	onSelect: () => void;
	onEdit: () => void;
	onToggleLock: () => void;
	onDragStart: () => void;
	onDragEnd: () => void;
}> = ({
	game,
	status,
	labelContext,
	selected,
	focused,
	dimmed,
	onSelect,
	onEdit,
	onToggleLock,
	onDragStart,
	onDragEnd
}) => {
	const type = championshipGameTypes.find((item) => item.value === game.type);
	const [team1, team2] = game.players;
	return (
		<div
			className={styles.card}
			data-status={status}
			data-selected={selected}
			data-focus={focused}
			data-dimmed={dimmed}
			data-locked={game.locked}
			draggable={!game.locked}
			onDragStart={(event) => {
				event.dataTransfer.setData("text/plain", game.id);
				event.dataTransfer.effectAllowed = "move";
				onDragStart();
			}}
			onDragEnd={onDragEnd}
			onClick={(event) => {
				event.stopPropagation();
				onSelect();
			}}
			onDoubleClick={onEdit}
		>
			<div className={styles.cardHeader}>
				<strong>Sp. {game.game_nr}</strong>
				<span className={styles.badge} data-type={game.type}>
					{type?.short || game.type}
				</span>
				<button
					type="button"
					className={styles.lock}
					data-locked={game.locked}
					title={game.locked ? "Gesperrt – Entsperren" : "Sperren"}
					onClick={(event) => {
						event.stopPropagation();
						onToggleLock();
					}}
				>
					{game.locked ? <Lock size={12} /> : <LockOpen size={12} />}
				</button>
			</div>
			<div className={styles.teams}>
				<span>{participantLabel(team1, labelContext)}</span>
				<span>– {participantLabel(team2, labelContext)}</span>
			</div>
			<span className={styles.referee}>
				SR: {participantLabel(game.referee, labelContext)}
			</span>
		</div>
	);
};

export default GameCard;
