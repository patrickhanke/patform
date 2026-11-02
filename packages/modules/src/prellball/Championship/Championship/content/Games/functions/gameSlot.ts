import {
	ChampionshipGame,
	ChampionshipGroup,
	ChampionshipSignUp,
	ClubClass
} from "@repo/types";
import { signupLabel } from "../../../../functions/signups";
import { DivisionCategory } from "../../../../../functions/divisions";

type Slot = "team1" | "team2" | "referee";

export const slotGameId = (game: ChampionshipGame, slot: Slot) => {
	if (slot === "team1") return game.team1_game_id;
	if (slot === "team2") return game.team2_game_id;
	return game.referee_game_id;
};

export const slotGroupId = (game: ChampionshipGame, slot: Slot) => {
	if (slot === "team1") return game.team1_group;
	if (slot === "team2") return game.team2_group;
	return game.referee_group;
};

export const slotIndex = (game: ChampionshipGame, slot: Slot) => {
	if (slot === "team1") return game.team1_index;
	if (slot === "team2") return game.team2_index;
	return game.referee_index;
};

/** Index 2 is the winner of the linked game, index 1 the loser. */
export const gameResultLabel = (index?: number) =>
	index === 2 ? "Sieger" : index === 1 ? "Verlierer" : "";

export const gameSlotLabel = ({
	game,
	slot,
	groups,
	signups,
	clubs,
	games,
	showClass,
	divisions = []
}: {
	game: ChampionshipGame;
	slot: Slot;
	groups: ChampionshipGroup[];
	signups: ChampionshipSignUp[];
	clubs: ClubClass[];
	games: ChampionshipGame[];
	showClass: boolean;
	divisions?: DivisionCategory[];
}) => {
	const linkedGameId = slotGameId(game, slot);
	const index = slotIndex(game, slot);
	if (linkedGameId) {
		const source = games.find((item) => item.id === linkedGameId);
		const result = gameResultLabel(index);
		if (!source) return "Spiel";
		return result
			? `${result} Spiel ${source.game_nr}`
			: `Spiel ${source.game_nr}`;
	}
	const subgroupId = slotGroupId(game, slot);
	if (!subgroupId || !index) return "—";
	const subgroup = groups
		.flatMap((group) => group.subgroups)
		.find((item) => item.id === subgroupId);
	const signupId = subgroup?.signup_ids[index - 1];
	const signup = signups.find((item) => item.id === signupId);
	if (!signup) return `${index}.`;
	return signupLabel(signup, signups, clubs, showClass, divisions);
};

export type { Slot };
