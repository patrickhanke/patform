import {
	CompetitionClass,
	CompetitionGame,
	CompetitionGroup,
	CompetitionMatchday,
	CompetitionSignup,
	CompetitionSubgroup
} from "@repo/types";

export const createId = () => {
	if (typeof crypto !== "undefined" && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

export const normalizeCompetition = (
	Competition: CompetitionClass | null
): CompetitionClass | null => {
	if (!Competition) {
		return null;
	}

	return {
		...Competition,
		show_class: Competition.show_class ?? false,
		ak_games: Competition.ak_games ?? false,
		open_signup: Competition.open_signup ?? false,
		free_signup: Competition.free_signup ?? false,
		secondary_teams: Competition.secondary_teams ?? false,
		group_mode: Competition.group_mode ?? false,
		classes: Competition.classes ?? [],
		gallery: Competition.gallery ?? [],
		matchdays: Competition.matchdays ?? [],
		signups: Competition.signups ?? [],
		groups: Competition.groups ?? [],
		games: Competition.games ?? []
	};
};

export const createMatchday = (
	partial: Partial<CompetitionMatchday> = {}
): CompetitionMatchday => ({
	id: createId(),
	eventId: "",
	spieltagNr: 1,
	felder: 1,
	pausen: [],
	durchgaenge: 1,
	...partial
});

export const createSignup = (
	partial: Partial<CompetitionSignup> = {}
): CompetitionSignup => ({
	id: createId(),
	entryId: "",
	number: 1,
	personIds: [],
	coachIds: [],
	refereeIds: [],
	active: true,
	...partial
});

export const createSubgroup = (
	partial: Partial<CompetitionSubgroup> = {}
): CompetitionSubgroup => ({
	id: createId(),
	label: "Gruppe A",
	signupIds: [],
	standings: [],
	closed: false,
	...partial
});

export const createGroup = (
	partial: Partial<CompetitionGroup> = {}
): CompetitionGroup => ({
	id: createId(),
	name: "Neue Gruppe",
	mode: "gruppe",
	closed: false,
	signupIds: [],
	subgroups: [createSubgroup()],
	...partial
});

export const createGame = (
	partial: Partial<CompetitionGame> = {}
): CompetitionGame => ({
	id: createId(),
	type: "grp",
	gameNr: 1,
	round: 1,
	field: 1,
	pass: 1,
	...partial
});
