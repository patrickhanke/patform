"use client";

import { FC, useEffect, useState } from "react";
import { Select, SlideIn } from "@repo/ui";
import { ChampionshipGame, ChampionshipGroup } from "@repo/types";
import { championshipGameTypes } from "../constants/gameTypes";
import { selectString } from "../../../../functions/selectValue";
import {
	Slot,
	slotGameId,
	slotGroupId,
	slotIndex
} from "../functions/gameSlot";

const slotValue = (game: ChampionshipGame, slot: Slot) => {
	const gameId = slotGameId(game, slot);
	const index = slotIndex(game, slot);
	if (gameId) return `game:${gameId}:${index ?? 2}`;
	const subgroupId = slotGroupId(game, slot);
	if (subgroupId && index) return `slot:${subgroupId}:${index}`;
	return "";
};

const applySlot = (game: ChampionshipGame, slot: Slot, value: string) => {
	const next = { ...game };
	const clear = () => {
		if (slot === "team1") {
			next.team1_game_id = "";
			next.team1_group = "";
			next.team1_index = undefined;
		}
		if (slot === "team2") {
			next.team2_game_id = "";
			next.team2_group = "";
			next.team2_index = undefined;
		}
		if (slot === "referee") {
			next.referee_game_id = "";
			next.referee_group = "";
			next.referee_index = undefined;
		}
	};
	clear();
	if (value.startsWith("game:")) {
		const [, gameId, index] = value.split(":");
		const result = Number(index) || 2;
		if (slot === "team1") {
			next.team1_game_id = gameId;
			next.team1_index = result;
		}
		if (slot === "team2") {
			next.team2_game_id = gameId;
			next.team2_index = result;
		}
		if (slot === "referee") {
			next.referee_game_id = gameId;
			next.referee_index = result;
		}
	}
	if (value.startsWith("slot:")) {
		const [, subgroupId, index] = value.split(":");
		const teamIndex = Number(index);
		if (slot === "team1") {
			next.team1_group = subgroupId;
			next.team1_index = teamIndex;
		}
		if (slot === "team2") {
			next.team2_group = subgroupId;
			next.team2_index = teamIndex;
		}
		if (slot === "referee") {
			next.referee_group = subgroupId;
			next.referee_index = teamIndex;
		}
	}
	return next;
};

const GameEditSlideIn: FC<{
	isOpen: boolean;
	game: ChampionshipGame | null;
	groups: ChampionshipGroup[];
	games: ChampionshipGame[];
	matchDays: { id: string; number: number }[];
	onClose: () => void;
	onSave: (game: ChampionshipGame) => void;
}> = ({ isOpen, game, groups, games, matchDays, onClose, onSave }) => {
	const [draft, setDraft] = useState<ChampionshipGame | null>(game);
	const [placement, setPlacement] = useState("");

	useEffect(() => {
		if (!isOpen) return;
		setDraft(game ? { ...game } : null);
		setPlacement(game?.placement?.join(", ") || "");
	}, [isOpen, game]);

	if (!draft) {
		return (
			<SlideIn header="Spiel" isOpen={false} cancel={onClose}>
				<p />
			</SlideIn>
		);
	}

	const typeOptions = championshipGameTypes.map((item) => ({
		value: item.value,
		label: item.label
	}));
	const matchDayOptions = matchDays.map((matchDay) => ({
		value: matchDay.id,
		label: `Spieltag ${matchDay.number}`
	}));
	const slotOptions = [
		{ value: "", label: "—" },
		...groups.flatMap((group) =>
			group.subgroups.flatMap((subgroup) =>
				subgroup.signup_ids.map((_, index) => ({
					value: `slot:${subgroup.id}:${index + 1}`,
					label: `${group.name} / ${subgroup.label} / ${index + 1}`
				}))
			)
		),
		...games
			.filter((item) => item.id !== draft.id)
			.flatMap((item) => [
				{
					value: `game:${item.id}:2`,
					label: `Sieger Spiel ${item.game_nr}`
				},
				{
					value: `game:${item.id}:1`,
					label: `Verlierer Spiel ${item.game_nr}`
				}
			])
	];

	const save = () => {
		const numbers = placement
			.split(",")
			.map((item) => Number(item.trim()))
			.filter((item) => !Number.isNaN(item));
		onSave({
			...draft,
			placement: draft.type === "plz" ? numbers : draft.placement
		});
	};

	return (
		<SlideIn
			header={`Spiel ${draft.game_nr || ""}`.trim()}
			isOpen={isOpen}
			cancel={onClose}
			confirm={save}
			confirmText="Übernehmen"
			size="large"
		>
			<div className="flex col a-st gap-sm">
				<Select
					id="game-matchday"
					label="Spieltag"
					options={matchDayOptions}
					value={
						matchDayOptions.find(
							(option) => option.value === draft.match_day_id
						) || null
					}
					onChange={(option) =>
						setDraft((current) =>
							current
								? {
										...current,
										match_day_id: selectString(option)
									}
								: current
						)
					}
				/>
				<label htmlFor="game-pass">Durchgang</label>
				<input
					id="game-pass"
					type="number"
					value={draft.pass}
					onChange={(event) =>
						setDraft((current) =>
							current
								? {
										...current,
										pass: Number(event.target.value) || 1
									}
								: current
						)
					}
				/>
				<label htmlFor="game-field">Feld</label>
				<input
					id="game-field"
					type="number"
					value={draft.field}
					onChange={(event) =>
						setDraft((current) =>
							current
								? {
										...current,
										field: Number(event.target.value) || 1
									}
								: current
						)
					}
				/>
				<label htmlFor="game-nr">Spiel</label>
				<input
					id="game-nr"
					type="number"
					value={draft.game_nr}
					onChange={(event) =>
						setDraft((current) =>
							current
								? {
										...current,
										game_nr: Number(event.target.value) || 1
									}
								: current
						)
					}
				/>
				<label htmlFor="game-round">Runde</label>
				<input
					id="game-round"
					type="number"
					value={draft.round}
					onChange={(event) =>
						setDraft((current) =>
							current
								? {
										...current,
										round: Number(event.target.value) || 1
									}
								: current
						)
					}
				/>
				<Select
					id="game-type"
					label="Typ"
					options={typeOptions}
					value={
						typeOptions.find(
							(option) => option.value === draft.type
						) || null
					}
					onChange={(option) =>
						setDraft((current) =>
							current
								? {
										...current,
										type:
											(selectString(
												option
											) as ChampionshipGame["type"]) ||
											"grp"
									}
								: current
						)
					}
				/>
				{(["team1", "team2", "referee"] as Slot[]).map((slot) => (
					<Select
						key={slot}
						id={`game-${slot}`}
						label={
							slot === "team1"
								? "Mannschaft 1"
								: slot === "team2"
									? "Mannschaft 2"
									: "Schiedsrichter"
						}
						options={slotOptions}
						value={
							slotOptions.find(
								(option) =>
									option.value === slotValue(draft, slot)
							) || slotOptions[0]
						}
						onChange={(option) =>
							setDraft((current) =>
								current
									? applySlot(
											current,
											slot,
											selectString(option)
										)
									: current
							)
						}
					/>
				))}
				{draft.type === "plz" ? (
					<>
						<label htmlFor="game-placement">Platzierungen</label>
						<input
							id="game-placement"
							value={placement}
							onChange={(event) =>
								setPlacement(event.target.value)
							}
						/>
					</>
				) : null}
			</div>
		</SlideIn>
	);
};

export default GameEditSlideIn;
