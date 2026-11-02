import {
	ChampionshipGame,
	ChampionshipGroup,
	ChampionshipSignUp,
	ClubClass
} from "@repo/types";
import { DivisionCategory } from "../../../../functions/divisions";

/**
 * Who occupies a game slot.
 * `team` is a known sign-up, `place` a standings place of a subgroup that is
 * still being played, `game` the winner or loser of another game.
 */
export type ParticipantKind = "team" | "place" | "game";

export type Participant = {
	key: string;
	kind: ParticipantKind;
	subgroupId?: string;
	index?: number;
	gameId?: string;
	signupId?: string;
};

export type GamePrerequisite =
	| { kind: "subgroup"; subgroupId: string; gameIds: string[] }
	| { kind: "game"; gameId: string; index?: number };

export type ScheduleModelGame = {
	id: string;
	game_nr: number;
	type: ChampionshipGame["type"];
	locked: boolean;
	players: Participant[];
	referee?: Participant;
	prerequisites: GamePrerequisite[];
	/** Flat list of game ids that must be finished first. */
	requires: string[];
	/** Longest chain of games that wait for this one. */
	depth: number;
};

export type ScheduleModel = {
	games: ScheduleModelGame[];
	byId: Record<string, ScheduleModelGame>;
	participants: Record<string, Participant>;
	/** Subgroups whose slots in non-group games mean a standings place. */
	rankedSubgroups: string[];
};

export type GamePlacement = { pass: number; field: number };

export type Placements = Record<string, GamePlacement>;

export type ScheduleOptions = {
	fields: number;
	maxConsecutive: number;
};

export type ScheduleIssueKind =
	| "team_double"
	| "referee_double"
	| "field_double"
	| "field_range"
	| "dependency"
	| "streak";

export type ScheduleIssue = {
	id: string;
	kind: ScheduleIssueKind;
	severity: "error" | "warning";
	gameIds: string[];
	participant?: string;
	passes: number[];
	/** Unfinished prerequisites for `dependency` issues. */
	blockers?: string[];
};

export type MatrixCellStatus = "ok" | "double" | "streak" | "tight" | "blocked";

export type MatrixCell = {
	roles: ("play" | "referee")[];
	gameIds: string[];
	status: MatrixCellStatus;
};

export type MatrixRow = {
	key: string;
	cells: Record<number, MatrixCell>;
	played: number;
	refereed: number;
	longestStreak: number;
};

export type GameStatus = "ok" | "warning" | "error" | "blocked";

export type ScheduleAnalysis = {
	issues: ScheduleIssue[];
	gameStatus: Record<string, GameStatus>;
	rows: MatrixRow[];
	lastPass: number;
	score: number;
};

export type MoveSuggestion = {
	kind: "move" | "swap";
	gameId: string;
	pass: number;
	field: number;
	otherGameId?: string;
	score: number;
	errors: number;
};

export type CellTarget = "good" | "ok" | "bad";

export type ScheduleLabelContext = {
	groups: ChampionshipGroup[];
	signups: ChampionshipSignUp[];
	clubs: ClubClass[];
	games: ChampionshipGame[];
	showClass: boolean;
	divisions: DivisionCategory[];
};
