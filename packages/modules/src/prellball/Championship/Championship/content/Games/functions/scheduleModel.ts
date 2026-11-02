import { ChampionshipGame, ChampionshipGroup } from "@repo/types";
import { Slot, slotGameId, slotGroupId, slotIndex } from "./gameSlot";
import {
	GamePrerequisite,
	Participant,
	Placements,
	ScheduleModel,
	ScheduleModelGame
} from "../types";

const slots: Slot[] = ["team1", "team2", "referee"];

/** Subgroups whose standings come from group games. */
const subgroupsWithGroupGames = (games: ChampionshipGame[]) => {
	const ids = new Set<string>();
	games.forEach((game) => {
		if (game.type !== "grp") return;
		if (game.team1_group) ids.add(game.team1_group);
		if (game.team2_group) ids.add(game.team2_group);
	});
	return ids;
};

/**
 * Non-group games that point at a played subgroup mean a standings place,
 * matching `resolveSignupId` in the results editor.
 */
export const slotParticipant = (
	game: ChampionshipGame,
	slot: Slot,
	groups: ChampionshipGroup[],
	rankedSubgroups: Set<string>
): Participant | undefined => {
	const index = slotIndex(game, slot);
	const gameId = slotGameId(game, slot);
	if (gameId) {
		return {
			key: `game:${gameId}:${index ?? 0}`,
			kind: "game",
			gameId,
			index
		};
	}
	const subgroupId = slotGroupId(game, slot);
	if (!subgroupId || !index) return undefined;
	if (game.type !== "grp" && rankedSubgroups.has(subgroupId)) {
		return {
			key: `place:${subgroupId}:${index}`,
			kind: "place",
			subgroupId,
			index
		};
	}
	const signupId = groups
		.flatMap((group) => group.subgroups)
		.find((subgroup) => subgroup.id === subgroupId)?.signup_ids[index - 1];
	return {
		key: signupId ? `team:${signupId}` : `slot:${subgroupId}:${index}`,
		kind: "team",
		subgroupId,
		index,
		signupId
	};
};

const prerequisitesOf = (
	game: ChampionshipGame,
	dayIds: Set<string>,
	groupGames: Record<string, string[]>
) => {
	const prerequisites: GamePrerequisite[] = [];
	slots.forEach((slot) => {
		const gameId = slotGameId(game, slot);
		if (gameId) {
			if (gameId !== game.id && dayIds.has(gameId)) {
				prerequisites.push({
					kind: "game",
					gameId,
					index: slotIndex(game, slot)
				});
			}
			return;
		}
		const subgroupId = slotGroupId(game, slot);
		if (game.type === "grp" || !subgroupId) return;
		const gameIds = groupGames[subgroupId];
		if (!gameIds?.length) return;
		const known = prerequisites.some(
			(item) => item.kind === "subgroup" && item.subgroupId === subgroupId
		);
		if (!known)
			prerequisites.push({ kind: "subgroup", subgroupId, gameIds });
	});
	return prerequisites;
};

const withDepth = (games: ScheduleModelGame[]) => {
	const dependents: Record<string, string[]> = {};
	games.forEach((game) => {
		game.requires.forEach((id) => {
			dependents[id] = [...(dependents[id] || []), game.id];
		});
	});
	const depth: Record<string, number> = {};
	const visiting = new Set<string>();
	const resolve = (id: string): number => {
		const known = depth[id];
		if (known !== undefined) return known;
		if (visiting.has(id)) return 0;
		visiting.add(id);
		const value = (dependents[id] || []).reduce(
			(max, next) => Math.max(max, resolve(next) + 1),
			0
		);
		visiting.delete(id);
		depth[id] = value;
		return value;
	};
	return games.map((game) => ({ ...game, depth: resolve(game.id) }));
};

/**
 * Placement-independent view of one match day: who plays, who referees and
 * which games have to be finished first.
 */
export const buildScheduleModel = (
	dayGames: ChampionshipGame[],
	allGames: ChampionshipGame[],
	groups: ChampionshipGroup[]
): ScheduleModel => {
	const ranked = subgroupsWithGroupGames(allGames);
	const dayIds = new Set(dayGames.map((game) => game.id));
	const groupGames: Record<string, string[]> = {};
	dayGames.forEach((game) => {
		if (game.type !== "grp") return;
		[game.team1_group, game.team2_group].forEach((subgroupId) => {
			if (!subgroupId) return;
			const list = groupGames[subgroupId] || [];
			if (!list.includes(game.id)) list.push(game.id);
			groupGames[subgroupId] = list;
		});
	});

	const participants: Record<string, Participant> = {};
	const games = withDepth(
		dayGames.map((game) => {
			const players = (["team1", "team2"] as Slot[])
				.map((slot) => slotParticipant(game, slot, groups, ranked))
				.filter((item): item is Participant => Boolean(item));
			const referee = slotParticipant(game, "referee", groups, ranked);
			[...players, referee].forEach((participant) => {
				if (participant) participants[participant.key] = participant;
			});
			const prerequisites = prerequisitesOf(game, dayIds, groupGames);
			const requires = Array.from(
				new Set(
					prerequisites.flatMap((item) =>
						item.kind === "game" ? [item.gameId] : item.gameIds
					)
				)
			).filter((id) => id !== game.id);
			return {
				id: game.id,
				game_nr: game.game_nr,
				type: game.type,
				locked: Boolean(game.locked),
				players,
				referee,
				prerequisites,
				requires,
				depth: 0
			};
		})
	);

	return {
		games,
		byId: Object.fromEntries(games.map((game) => [game.id, game])),
		participants,
		rankedSubgroups: Array.from(ranked)
	};
};

export const placementsOf = (games: ChampionshipGame[]): Placements =>
	Object.fromEntries(
		games.map((game) => [game.id, { pass: game.pass, field: game.field }])
	);

export const withPlacements = (
	games: ChampionshipGame[],
	placements: Placements
) =>
	games.map((game) => {
		const at = placements[game.id];
		if (!at || (at.pass === game.pass && at.field === game.field)) {
			return game;
		}
		return { ...game, pass: at.pass, field: at.field };
	});
