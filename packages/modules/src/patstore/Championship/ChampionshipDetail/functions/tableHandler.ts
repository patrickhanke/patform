import {
	ChampionshipGame,
	ChampionshipGroup,
	ChampionshipSignup,
	ChampionshipStanding,
	NewsClass
} from "@repo/types";
import { getTeamLabel, signupLabel } from "./getTeamLabel";

const hasScore = (game: ChampionshipGame) =>
	typeof game.score1 === "number" &&
	typeof game.score2 === "number" &&
	game.score1 > 0 &&
	game.score2 > 0;

export const recalcGroupStandings = ({
	group,
	games,
	signups,
	entries
}: {
	group: ChampionshipGroup;
	games: ChampionshipGame[];
	signups: ChampionshipSignup[];
	entries: NewsClass[];
}): ChampionshipGroup => {
	const groupGames = games.filter((game) => game.groupId === group.id);
	let allClosed = true;

	const subgroups = group.subgroups.map((subgroup) => {
		const subgroupSignups = signups.filter((signup) =>
			subgroup.signupIds.includes(signup.id)
		);

		const standings: ChampionshipStanding[] = subgroupSignups.map(
			(signup, index) => ({
				signupId: signup.id,
				label: signupLabel(signup, entries),
				place: index + 1,
				pointsFor: 0,
				pointsAgainst: 0,
				ballsFor: 0,
				ballsAgainst: 0,
				games: 0,
				decider: 0
			})
		);

		const relevantGames = groupGames.filter((game) => {
			const labels = getTeamLabel(game, games, [group], signups, entries);
			return (
				subgroup.signupIds.includes(labels.team1.signupId || "") &&
				subgroup.signupIds.includes(labels.team2.signupId || "")
			);
		});

		relevantGames.forEach((game) => {
			if (game.type === "ent" || !hasScore(game)) {
				return;
			}
			const labels = getTeamLabel(game, games, [group], signups, entries);
			standings.forEach((row) => {
				if (row.signupId === labels.team1.signupId) {
					row.ballsFor += game.score1 || 0;
					row.ballsAgainst += game.score2 || 0;
					if ((game.score1 || 0) > (game.score2 || 0)) {
						row.pointsFor += 2;
					} else if ((game.score1 || 0) < (game.score2 || 0)) {
						row.pointsAgainst += 2;
					} else {
						row.pointsFor += 1;
						row.pointsAgainst += 1;
					}
					row.games += 1;
				}
				if (row.signupId === labels.team2.signupId) {
					row.ballsFor += game.score2 || 0;
					row.ballsAgainst += game.score1 || 0;
					if ((game.score2 || 0) > (game.score1 || 0)) {
						row.pointsFor += 2;
					} else if ((game.score2 || 0) < (game.score1 || 0)) {
						row.pointsAgainst += 2;
					} else {
						row.pointsFor += 1;
						row.pointsAgainst += 1;
					}
					row.games += 1;
				}
			});
		});

		relevantGames.forEach((game) => {
			if (game.type !== "ent" || !hasScore(game)) {
				return;
			}
			const labels = getTeamLabel(game, games, [group], signups, entries);
			standings.forEach((row) => {
				if (row.signupId === labels.team1.signupId) {
					row.decider +=
						(game.score1 || 0) > (game.score2 || 0) ? 3 : -2;
				}
				if (row.signupId === labels.team2.signupId) {
					row.decider +=
						(game.score2 || 0) > (game.score1 || 0) ? 3 : -2;
				}
			});
		});

		const sorted = [...standings].sort((a, b) => {
			const scoreA =
				a.pointsFor +
				a.decider / 100 +
				(a.ballsFor - a.ballsAgainst) / 10000;
			const scoreB =
				b.pointsFor +
				b.decider / 100 +
				(b.ballsFor - b.ballsAgainst) / 10000;
			return scoreB - scoreA;
		});

		sorted.forEach((row, index) => {
			row.place = index + 1;
		});

		const subgroupClosed =
			relevantGames.length > 0 &&
			relevantGames.every(
				(game) =>
					game.type === "ent" || hasScore(game) || game.score1 != null
			);
		if (!subgroupClosed) {
			allClosed = false;
		}

		return {
			...subgroup,
			standings: sorted,
			closed: subgroupClosed
		};
	});

	return {
		...group,
		subgroups,
		closed: allClosed && subgroups.length > 0
	};
};

/**
 * Client standings recalculation. Prefer Sashido `championshipRecalcStandings`
 * once it exists so concurrent score writes cannot clobber `groups[]`.
 */
export const recalcChampionshipStandings = ({
	groups,
	games,
	signups,
	entries
}: {
	groups: ChampionshipGroup[];
	games: ChampionshipGame[];
	signups: ChampionshipSignup[];
	entries: NewsClass[];
}): ChampionshipGroup[] =>
	groups.map((group) =>
		recalcGroupStandings({ group, games, signups, entries })
	);
