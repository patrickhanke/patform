import {
	ChampionshipGame,
	ChampionshipGroup,
	ChampionshipSignUp,
	ChampionshipStanding,
	ClubClass
} from "@repo/types";
import { resolveSignupId, resolveTeam } from "./resolveTeam";

type Row = ChampionshipStanding & { sort: number };

const scored = (game: ChampionshipGame) =>
	typeof game.score1 === "number" &&
	typeof game.score2 === "number" &&
	game.score1 > 0 &&
	game.score2 > 0;

const headToHead = (
	games: ChampionshipGame[],
	groups: ChampionshipGroup[],
	leftId: string,
	rightId: string
) => {
	let left = 0;
	let right = 0;
	let ballDiff = 0;
	games.forEach((game) => {
		if (game.type === "ent" || !scored(game)) return;
		const team1 = resolveSignupId(game, "team1", groups, games);
		const team2 = resolveSignupId(game, "team2", groups, games);
		const score1 = game.score1 || 0;
		const score2 = game.score2 || 0;
		if (team1 === leftId && team2 === rightId) {
			ballDiff += score1 - score2;
			if (score1 > score2) left += 2;
			else if (score1 < score2) right += 2;
			else {
				left += 1;
				right += 1;
			}
		}
		if (team1 === rightId && team2 === leftId) {
			ballDiff += score2 - score1;
			if (score1 > score2) right += 2;
			else if (score1 < score2) left += 2;
			else {
				left += 1;
				right += 1;
			}
		}
	});
	return { left, right, ballDiff };
};

const deciderValue = (
	games: ChampionshipGame[],
	groups: ChampionshipGroup[],
	leftId: string,
	rightId: string
) => {
	let left = 0;
	let right = 0;
	games.forEach((game) => {
		if (game.type !== "ent" || !scored(game)) return;
		const team1 = resolveSignupId(game, "team1", groups, games);
		const team2 = resolveSignupId(game, "team2", groups, games);
		const score1 = game.score1 || 0;
		const score2 = game.score2 || 0;
		const apply = (home: "left" | "right", win: boolean, draw: boolean) => {
			if (draw) {
				left += 1;
				right += 1;
				return;
			}
			if (home === "left") {
				left += win ? 3 : -2;
				right += win ? -2 : 3;
			} else {
				right += win ? 3 : -2;
				left += win ? -2 : 3;
			}
		};
		if (team1 === leftId && team2 === rightId) {
			apply("left", score1 > score2, score1 === score2);
		}
		if (team1 === rightId && team2 === leftId) {
			apply("right", score1 > score2, score1 === score2);
		}
	});
	return left - right;
};

export const calculateGroupStandings = (
	groups: ChampionshipGroup[],
	games: ChampionshipGame[],
	signups: ChampionshipSignUp[],
	clubs: ClubClass[]
): ChampionshipGroup[] =>
	groups.map((group) => ({
		...group,
		subgroups: group.subgroups.map((subgroup) => {
			const subgroupGames = games.filter(
				(game) =>
					(game.type === "grp" || game.type === "ent") &&
					game.group_id === group.id &&
					(game.team1_group === subgroup.id ||
						game.team2_group === subgroup.id)
			);
			const rows: Row[] = subgroup.signup_ids.map((signupId, index) => {
				const signup = signups.find((item) => item.id === signupId);
				const label = signup
					? resolveTeam(
							{
								id: "",
								type: "grp",
								game_nr: 0,
								round: 1,
								field: 1,
								pass: 1,
								team1_group: subgroup.id,
								team1_index: index + 1
							},
							"team1",
							[{ ...group, subgroups: [subgroup] }],
							[],
							signups,
							clubs,
							false
						).label
					: `${index + 1}.`;
				const row: Row = {
					signup_id: signupId,
					label,
					place: index + 1,
					points_for: 0,
					points_against: 0,
					balls_for: 0,
					balls_against: 0,
					games: 0,
					decider: 0,
					sort: 0
				};
				subgroupGames.forEach((game) => {
					if (game.type === "ent" || !scored(game)) return;
					const team1 = resolveSignupId(game, "team1", groups, games);
					const team2 = resolveSignupId(game, "team2", groups, games);
					const score1 = game.score1 || 0;
					const score2 = game.score2 || 0;
					if (team1 === signupId) {
						row.balls_for += score1;
						row.balls_against += score2;
						row.games += 1;
						if (score1 > score2) row.points_for += 2;
						else if (score1 < score2) row.points_against += 2;
						else {
							row.points_for += 1;
							row.points_against += 1;
						}
					}
					if (team2 === signupId) {
						row.balls_for += score2;
						row.balls_against += score1;
						row.games += 1;
						if (score2 > score1) row.points_for += 2;
						else if (score2 < score1) row.points_against += 2;
						else {
							row.points_for += 1;
							row.points_against += 1;
						}
					}
				});
				return row;
			});

			rows.forEach((row) => {
				let compare = 0;
				let decider = 0;
				rows.forEach((other) => {
					if (other.signup_id === row.signup_id) return;
					if (other.points_for !== row.points_for) return;
					const direct = headToHead(
						subgroupGames,
						groups,
						row.signup_id,
						other.signup_id
					);
					compare += direct.ballDiff;
					decider += deciderValue(
						subgroupGames,
						groups,
						row.signup_id,
						other.signup_id
					);
				});
				const difference = row.balls_for - row.balls_against;
				row.decider = decider;
				row.sort =
					row.points_for +
					decider / 100 +
					compare / 1000 +
					difference / 10000;
			});

			rows.sort((a, b) => b.sort - a.sort);
			const standings = rows.map((row, index) => ({
				signup_id: row.signup_id,
				label: row.label,
				place: index + 1,
				points_for: row.points_for,
				points_against: row.points_against,
				balls_for: row.balls_for,
				balls_against: row.balls_against,
				games: row.games,
				decider: row.decider
			}));

			const internalGames = subgroupGames.filter(
				(game) =>
					game.team1_group === subgroup.id &&
					game.team2_group === subgroup.id
			);
			const closed = internalGames.every(
				(game) =>
					typeof game.score1 === "number" &&
					typeof game.score2 === "number"
			);

			return { ...subgroup, standings, closed };
		})
	}));
