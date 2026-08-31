import { ClassProperties } from "./Classes";

export type CompetitionGameType = "grp" | "krz" | "plz" | "ent" | "akk";

export type CompetitionGroupMode = "gruppe" | "kreuz";

export type CompetitionMatchdayBreak = {
	pass: number;
	duration: number;
};

export type CompetitionMatchday = {
	id: string;
	eventId: string;
	spieltagNr: number;
	felder: number;
	pausen: CompetitionMatchdayBreak[];
	durchgaenge: number;
	hostEntryId?: string;
	contact?: string;
};

export type CompetitionSignup = {
	id: string;
	entryId: string;
	class?: string;
	number: number;
	status?: string;
	groupId?: string;
	subgroupId?: string;
	personIds: string[];
	coachIds?: string[];
	refereeIds?: string[];
	captainId?: string;
	comment?: string;
	active?: boolean;
	openSignup?: boolean;
};

export type CompetitionStanding = {
	signupId: string;
	label: string;
	place: number;
	pointsFor: number;
	pointsAgainst: number;
	ballsFor: number;
	ballsAgainst: number;
	games: number;
	decider: number;
};

export type CompetitionSubgroup = {
	id: string;
	label: string;
	signupIds: string[];
	standings: CompetitionStanding[];
	closed?: boolean;
};

export type CompetitionGroup = {
	id: string;
	name: string;
	mode: CompetitionGroupMode;
	color?: string;
	closed: boolean;
	signupIds: string[];
	subgroups: CompetitionSubgroup[];
};

export type CompetitionGame = {
	id: string;
	type: CompetitionGameType;
	gameNr: number;
	round: number;
	field: number;
	pass: number;
	placement?: number[];
	groupId?: string;
	eventId?: string;
	team1_group?: string;
	team1_index?: number;
	team1_gameId?: string;
	team2_group?: string;
	team2_index?: number;
	team2_gameId?: string;
	referee_group?: string;
	referee_index?: number;
	referee_gameId?: string;
	hz1?: number | null;
	hz2?: number | null;
	score1?: number | null;
	score2?: number | null;
	winnerSignupId?: string | null;
	loserSignupId?: string | null;
};

export type CompetitionTeamLabel = {
	label: string;
	signupId?: string;
	entryId?: string;
};

export type CompetitionClass = ClassProperties & {
	title: string;
	season?: string;
	deadline?: string;
	show_class: boolean;
	ak_games: boolean;
	info?: string;
	director?: string;
	email?: string;
	open_signup: boolean;
	free_signup: boolean;
	secondary_teams: boolean;
	group_mode: boolean;
	classes: string[];
	gallery: string[];
	article_id?: string;
	matchdays: CompetitionMatchday[];
	signups: CompetitionSignup[];
	groups: CompetitionGroup[];
	games: CompetitionGame[];
};
