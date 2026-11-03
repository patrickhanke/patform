"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import { Select, SlideIn } from "@repo/ui";
import {
	ChampionshipGame,
	ChampionshipGroup,
	ChampionshipSignUp,
	ClubClass
} from "@repo/types";
import { championshipGameTypes } from "../constants/gameTypes";
import { selectString } from "@repo/provider";
import { signupLabel } from "@repo/provider";
import {
	Slot,
	slotGameId,
	slotGroupId,
	slotIndex
} from "../functions/gameSlot";
import styles from "../games.module.scss";

const noGroupsSelected: Record<Slot, boolean> = {
	team1: false,
	team2: false,
	referee: false
};

const slotLabels: Record<Slot, string> = {
	team1: "Mannschaft 1",
	team2: "Mannschaft 2",
	referee: "Schiedsrichter"
};

/** Groups in "gruppe" mode only play round robin, deciders and friendlies. */
const typesForGroup = (group?: ChampionshipGroup) =>
	championshipGameTypes.filter(
		(item) =>
			group?.mode !== "gruppe" ||
			(item.value !== "krz" && item.value !== "plz")
	);

const FormRow: FC<{ id: string; label: string; children: ReactNode }> = ({
	id,
	label,
	children
}) => (
	<div className={styles.formRow}>
		<label htmlFor={id} className="no_margin">
			{label}
		</label>
		{children}
	</div>
);

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
	signups: ChampionshipSignUp[];
	clubs: ClubClass[];
	onClose: () => void;
	onSave: (game: ChampionshipGame) => void;
}> = ({
	isOpen,
	game,
	groups,
	games,
	matchDays,
	signups,
	clubs,
	onClose,
	onSave
}) => {
	const [draft, setDraft] = useState<ChampionshipGame | null>(game);
	const [placement, setPlacement] = useState("");
	const [allGroups, setAllGroups] =
		useState<Record<Slot, boolean>>(noGroupsSelected);

	console.log(draft);

	useEffect(() => {
		if (!isOpen) return;
		setDraft(game ? { ...game } : null);
		setPlacement(game?.placement?.join(", ") || "");
		const own = groups.find((item) => item.id === game?.group_id);
		const outside = (slot: Slot) => {
			const subgroupId = game ? slotGroupId(game, slot) : undefined;
			return Boolean(
				subgroupId &&
				!own?.subgroups.some((item) => item.id === subgroupId)
			);
		};
		setAllGroups({
			team1: outside("team1"),
			team2: outside("team2"),
			referee: outside("referee")
		});
	}, [isOpen, game, groups]);

	if (!draft) {
		return (
			<SlideIn header="Spiel" isOpen={false} cancel={onClose}>
				<p />
			</SlideIn>
		);
	}

	const group = groups.find((item) => item.id === draft.group_id);
	const typeOptions = typesForGroup(group).map((item) => ({
		value: item.value,
		label: item.label
	}));
	const groupOptions = groups.map((item) => ({
		value: item.id,
		label: item.name || "Gruppe"
	}));
	const matchDayOptions = matchDays.map((matchDay) => ({
		value: matchDay.id,
		label: `Spieltag ${matchDay.number}`
	}));
	const teamOptions = (onlyGroup?: ChampionshipGroup) =>
		(onlyGroup ? [onlyGroup] : groups).flatMap((item) =>
			item.subgroups.flatMap((subgroup) =>
				subgroup.signup_ids.map((signupId, index) => {
					const position = `${item.name} / ${subgroup.label} / ${index + 1}`;
					const signup = signups.find(
						(entry) => entry.id === signupId
					);
					return {
						value: `slot:${subgroup.id}:${index + 1}`,
						label: signup?.club_id
							? `${signupLabel(signup, signups, clubs, false)} (${position})`
							: position
					};
				})
			)
		);
	const resultOptions = games
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
		]);
	const canPickAll = groups.length > 1;
	/** Group games only pair teams of their group; results of other games do not apply. */
	const slotOptions = (slot: Slot) => [
		{ value: "", label: "—" },
		...teamOptions(canPickAll && allGroups[slot] ? undefined : group),
		...(draft.type === "grp" ? [] : resultOptions)
	];

	const isNew = !games.some((item) => item.id === draft.id);
	const setNumber =
		(key: "pass" | "field" | "game_nr" | "round") => (value: string) =>
			setDraft((current) =>
				current ? { ...current, [key]: Number(value) || 1 } : current
			);

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

	const numberFields: {
		key: "pass" | "field" | "game_nr" | "round";
		label: string;
	}[] = [
		{ key: "pass", label: "Durchgang" },
		{ key: "field", label: "Feld" },
		{ key: "game_nr", label: "Spiel" },
		{ key: "round", label: "Runde" }
	];

	console.log(groupOptions);

	return (
		<SlideIn
			header={
				isNew ? "Neues Spiel" : `Spiel ${draft.game_nr || ""}`.trim()
			}
			isOpen={isOpen}
			cancel={onClose}
			confirm={save}
			confirmText="Übernehmen"
			size="large"
		>
			<div className={styles.form}>
				<FormRow id="game-matchday" label="Spieltag">
					<Select
						id="game-matchday"
						width="100%"
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
				</FormRow>
				{numberFields.map(({ key, label }) => (
					<FormRow key={key} id={`game-${key}`} label={label}>
						<input
							id={`game-${key}`}
							type="number"
							min={1}
							value={draft[key]}
							onChange={(event) =>
								setNumber(key)(event.target.value)
							}
						/>
					</FormRow>
				))}
				<FormRow id="game-group" label="Gruppe">
					<Select
						id="game-group"
						width="100%"
						options={groupOptions}
						value={
							groupOptions.find(
								(option) => option.value === draft.group_id
							) || null
						}
						onChange={(option) =>
							setDraft((current) => {
								if (!current) return current;
								const groupId = selectString(option);
								const allowed = typesForGroup(
									groups.find((item) => item.id === groupId)
								).some((item) => item.value === current.type);
								return {
									...current,
									group_id: groupId,
									type: allowed ? current.type : "grp"
								};
							})
						}
					/>
				</FormRow>
				<FormRow id="game-type" label="Typ">
					<Select
						id="game-type"
						width="100%"
						options={typeOptions}
						value={
							typeOptions.find(
								(option) => option.value === draft.type
							) || null
						}
						onChange={(option) =>
							setDraft((current) => {
								if (!current) return current;
								const type =
									(selectString(
										option
									) as ChampionshipGame["type"]) || "grp";
								let next = { ...current, type };
								if (type === "grp") {
									(["team1", "team2", "referee"] as Slot[])
										.filter((slot) =>
											slotGameId(next, slot)
										)
										.forEach((slot) => {
											next = applySlot(next, slot, "");
										});
								}
								return next;
							})
						}
					/>
				</FormRow>
				{(["team1", "team2", "referee"] as Slot[]).map((slot) => (
					<FormRow
						key={slot}
						id={`game-${slot}`}
						label={slotLabels[slot]}
					>
						<div className={styles.slotControl}>
							<Select
								id={`game-${slot}`}
								width="100%"
								options={slotOptions(slot)}
								value={
									slotOptions(slot).find(
										(option) =>
											option.value ===
											slotValue(draft, slot)
									) || null
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
							{/* <label
								className={styles.allGroups}
								data-disabled={!canPickAll}
							>
								<input
									type="checkbox"
									disabled={!canPickAll}
									checked={canPickAll && allGroups[slot]}
									onChange={(event) =>
										setAllGroups((current) => ({
											...current,
											[slot]: event.target.checked
										}))
									}
								/>
								Aus allen Gruppen wählen
							</label> */}
						</div>
					</FormRow>
				))}
				{draft.type === "plz" ? (
					<FormRow id="game-placement" label="Platzierungen">
						<input
							id="game-placement"
							value={placement}
							onChange={(event) =>
								setPlacement(event.target.value)
							}
						/>
					</FormRow>
				) : null}
			</div>
		</SlideIn>
	);
};

export default GameEditSlideIn;
