import {
	ChampionshipGame,
	ChampionshipGroup,
	ChampionshipSignup,
	ChampionshipTeamLabel,
	ClubClass
} from "@repo/types";

const findSubgroup = (groups: ChampionshipGroup[], subgroupId?: string) => {
	if (!subgroupId) {
		return undefined;
	}
	for (const group of groups) {
		const subgroup = group.subgroups.find((item) => item.id === subgroupId);
		if (subgroup) {
			return subgroup;
		}
	}
	return undefined;
};

export const signupLabel = (
	signup: ChampionshipSignup | undefined,
	clubs: Pick<ClubClass, "objectId" | "title">[],
	showClass?: boolean
): string => {
	if (!signup) {
		return "Unbestimmt";
	}
	const club = clubs.find((item) => item.objectId === signup.entryId);
	const name = club?.title || "Mannschaft";
	const numbered = signup.number > 1 ? `${name} ${signup.number}` : name;
	if (showClass && signup.class) {
		return `${numbered} — ${signup.class}`;
	}
	return numbered;
};

export const getTeamLabel = (
	game: ChampionshipGame,
	games: ChampionshipGame[],
	groups: ChampionshipGroup[],
	signups: ChampionshipSignup[],
	clubs: Pick<ClubClass, "objectId" | "title">[],
	showClass = false
): {
	team1: ChampionshipTeamLabel;
	team2: ChampionshipTeamLabel;
	referee: ChampionshipTeamLabel;
} => {
	const resolveSlot = (
		groupId?: string,
		index?: number,
		linkedGameId?: string
	): ChampionshipTeamLabel => {
		if (linkedGameId) {
			const linked = games.find((item) => item.id === linkedGameId);
			if (!linked) {
				return { label: "Unbestimmt" };
			}
			if (index === 2) {
				if (linked.winnerSignupId) {
					const signup = signups.find(
						(item) => item.id === linked.winnerSignupId
					);
					return {
						label: signupLabel(signup, clubs, showClass),
						signupId: linked.winnerSignupId,
						entryId: signup?.entryId
					};
				}
				return { label: `Sieger aus Spiel ${linked.gameNr}` };
			}
			if (index === 1) {
				if (linked.loserSignupId) {
					const signup = signups.find(
						(item) => item.id === linked.loserSignupId
					);
					return {
						label: signupLabel(signup, clubs, showClass),
						signupId: linked.loserSignupId,
						entryId: signup?.entryId
					};
				}
				return { label: `Verlierer aus Spiel ${linked.gameNr}` };
			}
		}

		const subgroup = findSubgroup(groups, groupId);
		if (!subgroup || !index) {
			return { label: "Unbestimmt" };
		}

		if (game.type === "krz" || game.type === "plz") {
			if (subgroup.closed && subgroup.standings[index - 1]) {
				const standing = subgroup.standings[index - 1];
				const signup = signups.find(
					(item) => item.id === standing.signupId
				);
				return {
					label:
						standing.label ||
						signupLabel(signup, clubs, showClass),
					signupId: standing.signupId,
					entryId: signup?.entryId
				};
			}
			return { label: `${index}. — ${subgroup.label}` };
		}

		const signupId = subgroup.signupIds[index - 1];
		const signup = signups.find((item) => item.id === signupId);
		return {
			label: signupLabel(signup, clubs, showClass),
			signupId,
			entryId: signup?.entryId
		};
	};

	return {
		team1: resolveSlot(
			game.team1_group,
			game.team1_index,
			game.team1_gameId
		),
		team2: resolveSlot(
			game.team2_group,
			game.team2_index,
			game.team2_gameId
		),
		referee: resolveSlot(
			game.referee_group,
			game.referee_index,
			game.referee_gameId
		)
	};
};
