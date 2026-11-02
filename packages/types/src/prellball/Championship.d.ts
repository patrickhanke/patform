import { ClassProperties } from "../patstore/Classes";

/** Former Wettkaempfe.kategorie values. All of them live in one overview. */
export type ChampionshipCategory =
	"Meisterschaften" | "Bundesliga" | "Regionalmeisterschaften" | "Turniere";

/** Former Einstellungen form, without Info (`text`) and Downloads (`documents`). */
export type ChampionshipSettings = {
	deadline?: string;
	show_division: boolean;
	ak_games: boolean;
	staff_lead_id?: string;
	email?: string;
	group_mode: boolean;
	/** Former `zweitmannschaft`. */
	secondary_teams: boolean;
	open_signup: boolean;
	/** Most passes a team may play back to back before the schedule warns. */
	max_consecutive_passes?: number;
};

export type ChampionshipMatchDayBreak = {
	pass: number;
	duration: number;
};

/**
 * Former Spieltage row.
 * `club_id` is a Club objectId (former Vereine).
 * `location_id` is a Location objectId (former Hallen).
 */
export type ChampionshipMatchDay = {
	id: string;
	number: number;
	date?: string;
	club_id?: string;
	location_id?: string;
	fields: number;
	contact?: string;
	passes?: number;
	breaks?: ChampionshipMatchDayBreak[];
};

export type ChampionshipSignUpStatus =
	| "erstellt"
	| "eingeladen"
	| "eingereicht"
	| "gemeldet"
	| "abgelehnt"
	| "none";

/**
 * Former Meldungen row. Group membership is stored on the group, not here.
 * Person references are Person objectIds.
 */
export type ChampionshipSignUp = {
	id: string;
	/** Division category objectId stored on the championship `categories` list. */
	division: string;
	status: ChampionshipSignUpStatus;
	active: boolean;
	number: number;
	position: number;
	club_id?: string;
	person_ids: string[];
	coach_ids: string[];
	referee_ids: string[];
	captain_id?: string;
	comment?: string;
};

export type ChampionshipGroupMode = "gruppe" | "kreuz";

export type ChampionshipStanding = {
	signup_id: string;
	label: string;
	place: number;
	points_for: number;
	points_against: number;
	balls_for: number;
	balls_against: number;
	games: number;
	decider: number;
};

export type ChampionshipSubgroup = {
	id: string;
	label: string;
	signup_ids: string[];
	standings?: ChampionshipStanding[];
	closed?: boolean;
};

/** Former Gruppen row, including its Untergruppen. */
export type ChampionshipGroup = {
	id: string;
	name: string;
	mode: ChampionshipGroupMode;
	color?: string;
	subgroups: ChampionshipSubgroup[];
};

export type ChampionshipGameType = "grp" | "krz" | "plz" | "ent" | "akk";

/**
 * Former Games row.
 * Team slots use a 1-based index into `subgroups[].signup_ids`, matching the old `team1_index`.
 */
export type ChampionshipGame = {
	id: string;
	type: ChampionshipGameType;
	game_nr: number;
	round: number;
	field: number;
	pass: number;
	placement?: number[];
	group_id?: string;
	match_day_id?: string;
	team1_group?: string;
	team1_index?: number;
	team1_game_id?: string;
	team2_group?: string;
	team2_index?: number;
	team2_game_id?: string;
	referee_group?: string;
	referee_index?: number;
	referee_game_id?: string;
	half1?: number | null;
	half2?: number | null;
	score1?: number | null;
	score2?: number | null;
	winner_signup_id?: string;
	loser_signup_id?: string;
	/** Locked games keep their pass and field when the schedule is optimized. */
	locked?: boolean;
};

export type ChampionshipData = {
	match_days: ChampionshipMatchDay[];
	sign_ups: ChampionshipSignUp[];
	groups: ChampionshipGroup[];
	games: ChampionshipGame[];
	/** Legacy division codes. Selected divisions live in `categories`. */
	division: string[];
};

/**
 * Payload passed to game generation.
 * `notes` is free text from the generation slide-in.
 */
export type ChampionshipGameGenerationInput = {
	settings: ChampionshipSettings;
	season?: string;
	/** Selected division category objectIds. */
	division: string[];
	group_mode: boolean;
	match_day: ChampionshipMatchDay;
	groups: ChampionshipGroup[];
	sign_ups: ChampionshipSignUp[];
	notes?: string;
};

export type ChampionshipClass = Omit<ClassProperties, "data"> & {
	title: string;
	/** Former `info`. */
	text?: string;
	/** Download objectIds. Former championship downloads. */
	documents: string[];
	/** Image objectIds. Former `galerie`. */
	gallery: string[];
	/** Meisterschaften, Bundesliga, Regionalmeisterschaften or Turniere. */
	category?: string;
	/** Former `wettkampf` short code. */
	short?: string;
	slug?: string;
	/** Former `gruppenmodus`. */

	legacy_mode?: boolean;
	/** Old `Wettkaempfe` objectId, set by the playground transfer. */
	former_id?: string;
	settings: ChampionshipSettings;
	data: ChampionshipData;
};
