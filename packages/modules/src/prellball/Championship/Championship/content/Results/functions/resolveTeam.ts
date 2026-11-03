import {
	ChampionshipGame,
	ChampionshipGroup,
	ChampionshipSignUp,
	ClubClass
} from "@repo/types";
import { signupLabel } from "@repo/provider";
import { DivisionCategory } from "@repo/provider";

export type ResolvedTeam = {
	signupId?: string;
	label: string;
	division?: string;
	clubId?: string;
};

const subgroupById = (groups: ChampionshipGroup[], subgroupId?: string) =>
	groups
		.flatMap((group) => group.subgroups)
		.find((subgroup) => subgroup.id === subgroupId);

export const slotParts = (
	game: ChampionshipGame,
	slot: "team1" | "team2" | "referee"
) => {
	if (slot === "team1") {
		return {
			gameId: game.team1_game_id,
			subgroupId: game.team1_group,
			index: game.team1_index
		};
	}
	if (slot === "team2") {
		return {
			gameId: game.team2_game_id,
			subgroupId: game.team2_group,
			index: game.team2_index
		};
	}
	return {
		gameId: game.referee_game_id,
		subgroupId: game.referee_group,
		index: game.referee_index
	};
};

export const resolveSignupId = (
	game: ChampionshipGame,
	slot: "team1" | "team2" | "referee",
	groups: ChampionshipGroup[],
	games: ChampionshipGame[]
): string | undefined => {
	const { gameId, subgroupId, index } = slotParts(game, slot);
	if (gameId) {
		const source = games.find((item) => item.id === gameId);
		if (!source || !index) return undefined;
		if (index === 2) return source.winner_signup_id;
		if (index === 1) return source.loser_signup_id;
		return undefined;
	}
	if (!subgroupId || !index) return undefined;
	const subgroup = subgroupById(groups, subgroupId);
	if (!subgroup) return undefined;
	if (game.type !== "grp" && subgroup.closed && subgroup.standings?.length) {
		return (
			subgroup.standings[index - 1]?.signup_id ||
			subgroup.signup_ids[index - 1]
		);
	}
	return subgroup.signup_ids[index - 1];
};

export const resolveTeam = (
	game: ChampionshipGame,
	slot: "team1" | "team2" | "referee",
	groups: ChampionshipGroup[],
	games: ChampionshipGame[],
	signups: ChampionshipSignUp[],
	clubs: ClubClass[],
	showClass: boolean,
	divisions: DivisionCategory[] = []
): ResolvedTeam => {
	const signupId = resolveSignupId(game, slot, groups, games);
	const signup = signups.find((item) => item.id === signupId);
	if (!signup) {
		const { gameId, index } = slotParts(game, slot);
		if (gameId) {
			const source = games.find((item) => item.id === gameId);
			return {
				label: source
					? `Spiel ${source.game_nr}${index === 2 ? " Sieger" : index === 1 ? " Verlierer" : ""}`
					: "—"
			};
		}
		return { label: "—" };
	}
	return {
		signupId,
		label: signupLabel(signup, signups, clubs, showClass, divisions),
		division: signup.division,
		clubId: signup.club_id
	};
};

export const withWinner = (
	game: ChampionshipGame,
	groups: ChampionshipGroup[],
	games: ChampionshipGame[]
): ChampionshipGame => {
	const score1 = game.score1;
	const score2 = game.score2;
	if (typeof score1 !== "number" || typeof score2 !== "number") {
		return { ...game, winner_signup_id: "", loser_signup_id: "" };
	}
	const team1 = resolveSignupId(game, "team1", groups, games);
	const team2 = resolveSignupId(game, "team2", groups, games);
	if (score1 > score2) {
		return {
			...game,
			winner_signup_id: team1 || "",
			loser_signup_id: team2 || ""
		};
	}
	if (score2 > score1) {
		return {
			...game,
			winner_signup_id: team2 || "",
			loser_signup_id: team1 || ""
		};
	}
	return { ...game, winner_signup_id: "", loser_signup_id: "" };
};
