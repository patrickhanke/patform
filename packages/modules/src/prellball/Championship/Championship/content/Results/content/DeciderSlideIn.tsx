"use client";

import { FC, useEffect, useState } from "react";
import { Select, SlideIn } from "@repo/ui";
import {
	ChampionshipGame,
	ChampionshipGroup,
	ChampionshipSignUp
} from "@repo/types";
import { createGame, signupLabel } from "@repo/provider";
import { selectString } from "@repo/provider";
import { ClubClass } from "@repo/types";
import { useAppContext } from "@repo/provider";
import { useDivisionCategories } from "@repo/provider";

const slotForSignup = (groups: ChampionshipGroup[], signupId: string) => {
	for (const group of groups) {
		for (const subgroup of group.subgroups) {
			const index = subgroup.signup_ids.indexOf(signupId);
			if (index !== -1) {
				return {
					groupId: group.id,
					subgroupId: subgroup.id,
					index: index + 1
				};
			}
		}
	}
	return null;
};

const DeciderSlideIn: FC<{
	isOpen: boolean;
	matchDayId: string;
	games: ChampionshipGame[];
	groups: ChampionshipGroup[];
	signups: ChampionshipSignUp[];
	clubs: ClubClass[];
	onClose: () => void;
	onCreate: (game: ChampionshipGame) => void;
}> = ({
	isOpen,
	matchDayId,
	games,
	groups,
	signups,
	clubs,
	onClose,
	onCreate
}) => {
	const { project } = useAppContext();
	const divisions = useDivisionCategories(project?.objectId);
	const [pass, setPass] = useState(1);
	const [field, setField] = useState(1);
	const [team1, setTeam1] = useState("");
	const [team2, setTeam2] = useState("");

	useEffect(() => {
		if (!isOpen) return;
		setPass(1);
		setField(1);
		setTeam1("");
		setTeam2("");
	}, [isOpen]);

	const options = signups
		.filter((signup) => signup.club_id)
		.map((signup) => ({
			value: signup.id,
			label: signupLabel(signup, signups, clubs, true, divisions)
		}));
	const left = slotForSignup(groups, team1);
	const right = slotForSignup(groups, team2);
	const canSave = Boolean(left && right && team1 !== team2);

	return (
		<SlideIn
			header="Entscheidungsspiel"
			isOpen={isOpen}
			cancel={onClose}
			confirm={() => {
				if (!left || !right) return;
				const gameNr =
					games.reduce(
						(max, game) => Math.max(max, game.game_nr || 0),
						0
					) + 1;
				onCreate(
					createGame({
						type: "ent",
						game_nr: gameNr,
						pass,
						field,
						round: 1,
						match_day_id: matchDayId,
						group_id: left.groupId,
						team1_group: left.subgroupId,
						team1_index: left.index,
						team2_group: right.subgroupId,
						team2_index: right.index
					})
				);
			}}
			confirmText="Spiel anlegen"
			disabled={[false, !canSave]}
		>
			<div className="flex col a-st gap-sm">
				<label htmlFor="decider-pass">Durchgang</label>
				<input
					id="decider-pass"
					type="number"
					value={pass}
					onChange={(event) =>
						setPass(Number(event.target.value) || 1)
					}
				/>
				<label htmlFor="decider-field">Feld</label>
				<input
					id="decider-field"
					type="number"
					value={field}
					onChange={(event) =>
						setField(Number(event.target.value) || 1)
					}
				/>
				<Select
					id="decider-team1"
					label="Mannschaft 1"
					options={options}
					value={
						options.find((option) => option.value === team1) || null
					}
					onChange={(option) => setTeam1(selectString(option))}
				/>
				<Select
					id="decider-team2"
					label="Mannschaft 2"
					options={options}
					value={
						options.find((option) => option.value === team2) || null
					}
					onChange={(option) => setTeam2(selectString(option))}
				/>
				{team1 && team2 && !canSave ? (
					<p>
						Beide Mannschaften müssen einer Gruppe zugeordnet sein.
					</p>
				) : null}
			</div>
		</SlideIn>
	);
};

export default DeciderSlideIn;
