import {
	GameStatus,
	MatrixCell,
	MatrixRow,
	Participant,
	Placements,
	ScheduleAnalysis,
	ScheduleIssue,
	ScheduleModel,
	ScheduleOptions
} from "../types";

type Occupancy = Record<
	string,
	Record<number, { roles: MatrixCell["roles"]; gameIds: string[] }>
>;

const ERROR_WEIGHT = 1000;
const STREAK_WEIGHT = 20;
const PASS_WEIGHT = 2;

const statusRank: Record<GameStatus, number> = {
	ok: 0,
	warning: 1,
	blocked: 2,
	error: 3
};

const runsOf = (passes: number[]) => {
	const runs: number[][] = [];
	passes.forEach((pass) => {
		const last = runs[runs.length - 1];
		if (last && last[last.length - 1] === pass - 1) last.push(pass);
		else runs.push([pass]);
	});
	return runs;
};

export const errorCount = (analysis: ScheduleAnalysis) =>
	analysis.issues.filter((issue) => issue.severity === "error").length;

/**
 * Checks every hard rule (double bookings, fields, prerequisites) and the
 * consecutive-pass limit for one match day.
 */
export const analyzeSchedule = (
	model: ScheduleModel,
	placements: Placements,
	options: ScheduleOptions
): ScheduleAnalysis => {
	const maxConsecutive = Math.max(1, options.maxConsecutive);
	const issues: ScheduleIssue[] = [];
	const occupancy: Occupancy = {};
	const cells: Record<string, string[]> = {};
	let lastPass = 0;

	const occupy = (
		participant: Participant | undefined,
		pass: number,
		role: MatrixCell["roles"][number],
		gameId: string
	) => {
		if (!participant) return;
		const passes = occupancy[participant.key] || {};
		const entry = passes[pass] || { roles: [], gameIds: [] };
		entry.roles.push(role);
		entry.gameIds.push(gameId);
		passes[pass] = entry;
		occupancy[participant.key] = passes;
	};

	model.games.forEach((game) => {
		const at = placements[game.id];
		if (!at) return;
		lastPass = Math.max(lastPass, at.pass);
		game.players.forEach((player) =>
			occupy(player, at.pass, "play", game.id)
		);
		occupy(game.referee, at.pass, "referee", game.id);
		if (at.pass < 1 || at.field < 1 || at.field > options.fields) {
			issues.push({
				id: `field_range:${game.id}`,
				kind: "field_range",
				severity: "error",
				gameIds: [game.id],
				passes: [at.pass]
			});
		}
		const cell = `${at.pass}:${at.field}`;
		cells[cell] = [...(cells[cell] || []), game.id];
	});

	Object.entries(cells).forEach(([cell, gameIds]) => {
		if (gameIds.length < 2) return;
		issues.push({
			id: `field_double:${cell}`,
			kind: "field_double",
			severity: "error",
			gameIds,
			passes: [Number(cell.split(":")[0])]
		});
	});

	const blocked = new Set<string>();
	model.games.forEach((game) => {
		const at = placements[game.id];
		if (!at) return;
		const blockers = game.requires.filter((id) => {
			const before = placements[id];
			return before ? before.pass >= at.pass : false;
		});
		if (blockers.length === 0) return;
		blocked.add(game.id);
		issues.push({
			id: `dependency:${game.id}`,
			kind: "dependency",
			severity: "error",
			gameIds: [game.id],
			passes: [at.pass],
			blockers
		});
	});

	let streakExcess = 0;
	const rows: MatrixRow[] = Object.entries(occupancy).map(([key, passes]) => {
		const rowCells: Record<number, MatrixCell> = {};
		let played = 0;
		let refereed = 0;
		Object.entries(passes).forEach(([passKey, entry]) => {
			const pass = Number(passKey);
			played += entry.roles.filter((role) => role === "play").length;
			refereed += entry.roles.filter((role) => role === "referee").length;
			let status: MatrixCell["status"] = "ok";
			if (entry.gameIds.length > 1) {
				status = "double";
				issues.push({
					id: `double:${key}:${pass}`,
					kind: entry.roles.every((role) => role === "referee")
						? "referee_double"
						: "team_double",
					severity: "error",
					gameIds: entry.gameIds,
					participant: key,
					passes: [pass]
				});
			} else if (entry.gameIds.some((id) => blocked.has(id))) {
				status = "blocked";
			}
			rowCells[pass] = { ...entry, status };
		});

		const playPasses = Object.keys(passes)
			.map(Number)
			.filter((pass) => passes[pass]?.roles.includes("play"))
			.sort((a, b) => a - b);
		let longestStreak = 0;
		runsOf(playPasses).forEach((run) => {
			longestStreak = Math.max(longestStreak, run.length);
			const tooLong = run.length > maxConsecutive;
			const tight = run.length === maxConsecutive && maxConsecutive > 1;
			if (tooLong) {
				streakExcess += run.length - maxConsecutive;
				issues.push({
					id: `streak:${key}:${run[0]}`,
					kind: "streak",
					severity: "warning",
					gameIds: run.flatMap((pass) => passes[pass]?.gameIds || []),
					participant: key,
					passes: run
				});
			}
			if (!tooLong && !tight) return;
			run.forEach((pass) => {
				const cell = rowCells[pass];
				if (cell && cell.status === "ok") {
					cell.status = tooLong ? "streak" : "tight";
				}
			});
		});

		return { key, cells: rowCells, played, refereed, longestStreak };
	});

	const gameStatus: Record<string, GameStatus> = {};
	model.games.forEach((game) => {
		gameStatus[game.id] = "ok";
	});
	issues.forEach((issue) => {
		const status: GameStatus =
			issue.severity === "warning"
				? "warning"
				: issue.kind === "dependency"
					? "blocked"
					: "error";
		issue.gameIds.forEach((id) => {
			const current = gameStatus[id] || "ok";
			if (statusRank[status] > statusRank[current])
				gameStatus[id] = status;
		});
	});

	const errors = issues.filter((issue) => issue.severity === "error").length;
	return {
		issues,
		gameStatus,
		rows,
		lastPass,
		score:
			errors * ERROR_WEIGHT +
			streakExcess * STREAK_WEIGHT +
			lastPass * PASS_WEIGHT
	};
};
