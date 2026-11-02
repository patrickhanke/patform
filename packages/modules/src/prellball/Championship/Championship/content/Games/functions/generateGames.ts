import {
	ChampionshipGame,
	ChampionshipGameGenerationInput,
	ChampionshipGroup,
	ChampionshipSubgroup
} from "@repo/types";
import { createId } from "../../../../functions/ids";
import { DEFAULT_MAX_CONSECUTIVE_PASSES } from "../constants/gameTypes";
import { buildScheduleModel, withPlacements } from "./scheduleModel";
import { scheduleGames } from "./optimizeSchedule";

/** Pairs are 1-based indexes into the subgroup signup list. */
const roundRobinPairs = (count: number): Array<Array<[number, number]>> => {
	if (count < 2) return [];
	const list = Array.from({ length: count }, (_, index) => index + 1);
	if (count % 2 === 1) list.push(0);
	const size = list.length;
	const rotating = list.slice(1);
	const rounds: Array<Array<[number, number]>> = [];

	for (let round = 0; round < size - 1; round += 1) {
		const row = [list[0], ...rotating];
		const pairs: Array<[number, number]> = [];
		for (let index = 0; index < size / 2; index += 1) {
			const home = row[index];
			const away = row[size - 1 - index];
			if (home && away) pairs.push([home, away]);
		}
		rounds.push(pairs);
		const last = rotating.pop();
		if (last !== undefined) rotating.unshift(last);
	}

	return rounds;
};

const validSignupIds = (
	subgroup: ChampionshipSubgroup,
	knownIds: Set<string>
) => subgroup.signup_ids.filter((id) => knownIds.has(id));

const pushGame = (
	games: ChampionshipGame[],
	input: {
		type: ChampionshipGame["type"];
		groupId: string;
		matchDayId: string;
		round: number;
		team1Group: string;
		team1Index: number;
		team2Group: string;
		team2Index: number;
	}
) => {
	games.push({
		id: createId(),
		type: input.type,
		game_nr: games.length + 1,
		round: input.round,
		field: 1,
		pass: 1,
		group_id: input.groupId,
		match_day_id: input.matchDayId,
		team1_group: input.team1Group,
		team1_index: input.team1Index,
		team2_group: input.team2Group,
		team2_index: input.team2Index
	});
};

const addGroupGames = (
	group: ChampionshipGroup,
	matchDayId: string,
	knownIds: Set<string>,
	games: ChampionshipGame[]
) => {
	const subgroups = group.subgroups
		.map((subgroup) => ({
			...subgroup,
			signup_ids: validSignupIds(subgroup, knownIds)
		}))
		.filter((subgroup) => subgroup.signup_ids.length > 0);

	if (group.mode === "kreuz") {
		for (let left = 0; left < subgroups.length; left += 1) {
			for (let right = left + 1; right < subgroups.length; right += 1) {
				const home = subgroups[left];
				const away = subgroups[right];
				if (!home || !away) continue;
				home.signup_ids.forEach((_, homeIndex) => {
					away.signup_ids.forEach((__, awayIndex) => {
						pushGame(games, {
							type: "krz",
							groupId: group.id,
							matchDayId,
							round: 1,
							team1Group: home.id,
							team1Index: homeIndex + 1,
							team2Group: away.id,
							team2Index: awayIndex + 1
						});
					});
				});
			}
		}
		return;
	}

	subgroups.forEach((subgroup) => {
		roundRobinPairs(subgroup.signup_ids.length).forEach((pairs, round) => {
			pairs.forEach(([home, away]) => {
				pushGame(games, {
					type: "grp",
					groupId: group.id,
					matchDayId,
					round: round + 1,
					team1Group: subgroup.id,
					team1Index: home,
					team2Group: subgroup.id,
					team2Index: away
				});
			});
		});
	});
};

/**
 * Builds games from the same payload a model call would receive:
 * settings, one match day, groups and sign-ups. Passes and fields come from
 * the schedule optimizer, so no team plays twice in one pass.
 */
export const generateChampionshipGames = (
	input: ChampionshipGameGenerationInput
): ChampionshipGame[] => {
	const knownIds = new Set(input.sign_ups.map((signup) => signup.id));
	const games: ChampionshipGame[] = [];
	input.groups.forEach((group) => {
		addGroupGames(group, input.match_day.id, knownIds, games);
	});
	const model = buildScheduleModel(games, games, input.groups);
	const placements = scheduleGames(
		model,
		{},
		{
			fields: Math.max(1, input.match_day.fields || 1),
			maxConsecutive:
				input.settings.max_consecutive_passes ??
				DEFAULT_MAX_CONSECUTIVE_PASSES
		}
	);
	return withPlacements(games, placements)
		.sort((a, b) => a.pass - b.pass || a.field - b.field)
		.map((game, index) => ({ ...game, game_nr: index + 1 }));
};

export const mergeGeneratedGames = (
	existing: ChampionshipGame[],
	generated: ChampionshipGame[],
	matchDayId: string,
	groupIds: string[],
	replace: boolean
) => {
	const kept = replace
		? existing.filter(
				(game) =>
					!(
						game.match_day_id === matchDayId &&
						groupIds.includes(game.group_id || "")
					)
			)
		: existing;
	const start =
		kept.reduce((max, game) => Math.max(max, game.game_nr || 0), 0) + 1;
	return [
		...kept,
		...generated.map((game, index) => ({
			...game,
			game_nr: start + index
		}))
	];
};
