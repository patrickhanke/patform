import { ChampionshipGame } from "@repo/types";
import {
	CellTarget,
	MoveSuggestion,
	Participant,
	Placements,
	ScheduleModel,
	ScheduleModelGame,
	ScheduleOptions
} from "../types";
import { analyzeSchedule, errorCount } from "./validateSchedule";

const keysOf = (game: ScheduleModelGame) =>
	[...game.players, game.referee]
		.filter((item): item is Participant => Boolean(item))
		.map((item) => item.key);

/**
 * Greedy pass-by-pass scheduler. Hard rules are never broken for games it
 * places; the consecutive-pass limit is only exceeded when a pass would
 * otherwise stay empty. Locked games and games before `fromPass` stay put.
 */
export const scheduleGames = (
	model: ScheduleModel,
	placements: Placements,
	options: ScheduleOptions,
	fromPass = 1
): Placements => {
	const maxConsecutive = Math.max(1, options.maxConsecutive);
	const fields = Math.max(1, options.fields);
	const result: Placements = {};
	const busy: Record<number, Set<string>> = {};
	const usedFields: Record<number, Set<number>> = {};
	const played: Record<string, Set<number>> = {};
	const remaining: Record<string, number> = {};

	const occupy = (game: ScheduleModelGame, pass: number, field: number) => {
		result[game.id] = { pass, field };
		const keys = busy[pass] || new Set<string>();
		keysOf(game).forEach((key) => keys.add(key));
		busy[pass] = keys;
		const used = usedFields[pass] || new Set<number>();
		used.add(field);
		usedFields[pass] = used;
		game.players.forEach((player) => {
			const set = played[player.key] || new Set<number>();
			set.add(pass);
			played[player.key] = set;
		});
	};

	const isFixed = (game: ScheduleModelGame) => {
		const at = placements[game.id];
		if (game.locked) return Boolean(at);
		return Boolean(at && at.pass >= 1 && at.pass < fromPass);
	};

	let pending: ScheduleModelGame[] = [];
	let lastFixed = 0;
	model.games.forEach((game) => {
		const at = placements[game.id];
		if (at && isFixed(game)) {
			occupy(game, at.pass, at.field);
			lastFixed = Math.max(lastFixed, at.pass);
		} else {
			pending.push(game);
			game.players.forEach((player) => {
				remaining[player.key] = (remaining[player.key] || 0) + 1;
			});
		}
	});

	const streakWith = (key: string, pass: number) => {
		const set = played[key];
		if (!set) return 1;
		let length = 1;
		for (let item = pass - 1; set.has(item); item -= 1) length += 1;
		for (let item = pass + 1; set.has(item); item += 1) length += 1;
		return length;
	};

	const restBefore = (key: string, pass: number) => {
		const set = played[key];
		if (!set) return pass;
		let rest = pass;
		set.forEach((item) => {
			if (item < pass) rest = Math.min(rest, pass - item);
		});
		return rest;
	};

	const limit = Math.max(fromPass, lastFixed) + pending.length * 2 + 2;
	for (let pass = fromPass; pending.length > 0 && pass <= limit; pass += 1) {
		const taken = busy[pass] || new Set<string>();
		busy[pass] = taken;
		const used = usedFields[pass] || new Set<number>();
		const freeFields = Array.from(
			{ length: fields },
			(_, index) => index + 1
		).filter((field) => !used.has(field));
		if (freeFields.length === 0) continue;

		const ready = pending
			.filter((game) =>
				game.requires.every((id) => {
					const at = result[id];
					return at ? at.pass < pass : false;
				})
			)
			.map((game) => ({
				game,
				load: Math.max(
					0,
					...game.players.map((player) => remaining[player.key] || 0)
				),
				rest: Math.min(
					3,
					...game.players.map((player) =>
						restBefore(player.key, pass)
					)
				)
			}))
			.sort(
				(a, b) =>
					b.game.depth - a.game.depth ||
					b.rest - a.rest ||
					b.load - a.load ||
					a.game.game_nr - b.game.game_nr
			);

		const chosen: ScheduleModelGame[] = [];
		const pick = (allowStreak: boolean) => {
			ready.forEach(({ game }) => {
				if (chosen.length >= freeFields.length) return;
				if (chosen.includes(game)) return;
				const keys = keysOf(game);
				if (keys.some((key) => taken.has(key))) return;
				const tooLong = game.players.some(
					(player) => streakWith(player.key, pass) > maxConsecutive
				);
				if (tooLong && !allowStreak) return;
				chosen.push(game);
				keys.forEach((key) => taken.add(key));
			});
		};
		pick(false);
		if (chosen.length === 0 && used.size === 0) pick(true);

		const open = [...freeFields];
		const later: ScheduleModelGame[] = [];
		chosen.forEach((game) => {
			const field = placements[game.id]?.field;
			if (field === undefined || !open.includes(field)) {
				later.push(game);
				return;
			}
			open.splice(open.indexOf(field), 1);
			occupy(game, pass, field);
		});
		later.forEach((game) => occupy(game, pass, open.shift() ?? 1));
		chosen.forEach((game) => {
			game.players.forEach((player) => {
				remaining[player.key] = (remaining[player.key] || 1) - 1;
			});
		});
		pending = pending.filter((game) => !chosen.includes(game));
	}

	pending.forEach((game, index) => {
		occupy(
			game,
			limit + 1 + Math.floor(index / fields),
			(index % fields) + 1
		);
	});
	return result;
};

/** Moves a game to a cell, swapping with the game already there. */
export const moveInPlacements = (
	model: ScheduleModel,
	placements: Placements,
	gameId: string,
	pass: number,
	field: number
): { placements: Placements; otherGameId?: string } | null => {
	const from = placements[gameId];
	if (!from) return null;
	const otherGameId = model.games.find((game) => {
		const at = placements[game.id];
		return game.id !== gameId && at?.pass === pass && at.field === field;
	})?.id;
	if (otherGameId && model.byId[otherGameId]?.locked) return null;
	const next = { ...placements, [gameId]: { pass, field } };
	if (otherGameId) next[otherGameId] = { ...from };
	return { placements: next, otherGameId };
};

/**
 * Rates every cell for one game. `bad` means the game (or the game it would
 * swap with) breaks a hard rule there, `good` means the whole day improves.
 */
export const evaluateTargets = (
	model: ScheduleModel,
	placements: Placements,
	options: ScheduleOptions,
	gameId: string,
	passes: number
): { targets: Record<string, CellTarget>; suggestions: MoveSuggestion[] } => {
	const targets: Record<string, CellTarget> = {};
	const suggestions: MoveSuggestion[] = [];
	const from = placements[gameId];
	if (!from || model.byId[gameId]?.locked) return { targets, suggestions };
	const base = analyzeSchedule(model, placements, options);
	const baseErrors = errorCount(base);

	for (let pass = 1; pass <= passes; pass += 1) {
		for (let field = 1; field <= options.fields; field += 1) {
			const cell = `${pass}:${field}`;
			if (from.pass === pass && from.field === field) continue;
			const moved = moveInPlacements(
				model,
				placements,
				gameId,
				pass,
				field
			);
			if (!moved) {
				targets[cell] = "bad";
				continue;
			}
			const result = analyzeSchedule(model, moved.placements, options);
			const errors = errorCount(result);
			const involved = [gameId, moved.otherGameId].filter(
				(id): id is string => Boolean(id)
			);
			const broken = (status?: string) =>
				status === "error" || status === "blocked";
			const hardFail = involved.some((id) =>
				broken(result.gameStatus[id])
			);
			const breaksOthers = model.games.some(
				(game) =>
					!involved.includes(game.id) &&
					broken(result.gameStatus[game.id]) &&
					!broken(base.gameStatus[game.id])
			);
			if (hardFail || breaksOthers || errors > baseErrors) {
				targets[cell] = "bad";
				continue;
			}
			const better = result.score < base.score;
			targets[cell] = better ? "good" : "ok";
			if (!better) continue;
			suggestions.push({
				kind: moved.otherGameId ? "swap" : "move",
				gameId,
				pass,
				field,
				otherGameId: moved.otherGameId,
				score: result.score,
				errors
			});
		}
	}

	suggestions.sort((a, b) => a.score - b.score);
	return { targets, suggestions: suggestions.slice(0, 3) };
};

/**
 * Fills empty referee slots with teams of the same group that are free in
 * that pass, preferring the fewest duties and teams that just played.
 * In non-group games a subgroup slot is a standings place, so candidates
 * there are places, not sign-ups.
 */
export const assignReferees = (
	model: ScheduleModel,
	games: ChampionshipGame[],
	placements: Placements
): ChampionshipGame[] => {
	const teams = Object.values(model.participants).filter(
		(participant) =>
			participant.kind === "team" &&
			participant.signupId &&
			participant.subgroupId &&
			participant.index
	);
	const busy: Record<number, Set<string>> = {};
	const playedAt: Record<string, Set<number>> = {};
	const duties: Record<string, number> = {};
	model.games.forEach((game) => {
		const at = placements[game.id];
		if (!at) return;
		const keys = busy[at.pass] || new Set<string>();
		keysOf(game).forEach((key) => keys.add(key));
		busy[at.pass] = keys;
		game.players.forEach((player) => {
			const set = playedAt[player.key] || new Set<number>();
			set.add(at.pass);
			playedAt[player.key] = set;
		});
		if (game.referee) {
			duties[game.referee.key] = (duties[game.referee.key] || 0) + 1;
		}
	});

	const subgroupsByGroup: Record<string, Set<string>> = {};
	games.forEach((game) => {
		if (!game.group_id) return;
		const set = subgroupsByGroup[game.group_id] || new Set<string>();
		[game.team1_group, game.team2_group].forEach((id) => id && set.add(id));
		subgroupsByGroup[game.group_id] = set;
	});

	const open = games
		.flatMap((game) => {
			const at = placements[game.id];
			if (!at || model.byId[game.id]?.referee || game.referee_game_id) {
				return [];
			}
			return [{ game, pass: at.pass, field: at.field }];
		})
		.sort((a, b) => a.pass - b.pass || a.field - b.field);

	const ranked = new Set(model.rankedSubgroups);
	const assigned: Record<string, { subgroupId: string; index: number }> = {};
	open.forEach(({ game, pass }) => {
		const taken = busy[pass] || new Set<string>();
		const ownSubgroups = subgroupsByGroup[game.group_id || ""];
		const candidates = teams.map((team) =>
			game.type !== "grp" && ranked.has(team.subgroupId || "")
				? {
						...team,
						key: `place:${team.subgroupId}:${team.index}`
					}
				: team
		);
		const free = candidates.filter((team) => !taken.has(team.key));
		const sameGroup = free.filter((team) =>
			ownSubgroups?.has(team.subgroupId || "")
		);
		const pool = sameGroup.length > 0 ? sameGroup : free;
		const nearby = (key: string) => {
			const set = playedAt[key];
			return set && (set.has(pass - 1) || set.has(pass + 1)) ? 0 : 1;
		};
		const best = pool.sort(
			(a, b) =>
				(duties[a.key] || 0) - (duties[b.key] || 0) ||
				nearby(a.key) - nearby(b.key)
		)[0];
		if (!best?.subgroupId || !best.index) return;
		taken.add(best.key);
		busy[pass] = taken;
		duties[best.key] = (duties[best.key] || 0) + 1;
		assigned[game.id] = { subgroupId: best.subgroupId, index: best.index };
	});

	return games.map((game) => {
		const slot = assigned[game.id];
		if (!slot) return game;
		return {
			...game,
			referee_group: slot.subgroupId,
			referee_index: slot.index,
			referee_game_id: ""
		};
	});
};

/** Reuses the day's game numbers in pass and field order. */
export const renumberGames = (games: ChampionshipGame[]) => {
	const numbers = games.map((game) => game.game_nr).sort((a, b) => a - b);
	const ordered = [...games].sort(
		(a, b) => a.pass - b.pass || a.field - b.field || a.game_nr - b.game_nr
	);
	const next: Record<string, number> = {};
	ordered.forEach((game, index) => {
		next[game.id] = numbers[index] ?? game.game_nr;
	});
	return games.map((game) => ({
		...game,
		game_nr: next[game.id] ?? game.game_nr
	}));
};
