import {
	ChampionshipClass,
	ChampionshipGame,
	ChampionshipGroup,
	ChampionshipMatchday,
	ChampionshipSignup,
	ChampionshipSubgroup
} from "@repo/types";

export const createId = () => {
	if (typeof crypto !== "undefined" && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

export const normalizeChampionship = (
	championship: ChampionshipClass | null
): ChampionshipClass | null => {
	if (!championship) {
		return null;
	}

	return {
		...championship,
		show_class: championship.show_class ?? false,
		ak_games: championship.ak_games ?? false,
		open_signup: championship.open_signup ?? false,
		free_signup: championship.free_signup ?? false,
		secondary_teams: championship.secondary_teams ?? false,
		group_mode: championship.group_mode ?? false,
		classes: championship.classes ?? [],
		gallery: championship.gallery ?? [],
		matchdays: championship.matchdays ?? [],
		signups: championship.signups ?? [],
		groups: championship.groups ?? [],
		games: championship.games ?? []
	};
};

export const createMatchday = (
	partial: Partial<ChampionshipMatchday> = {}
): ChampionshipMatchday => ({
	id: createId(),
	eventId: "",
	spieltagNr: 1,
	felder: 1,
	pausen: [],
	durchgaenge: 1,
	...partial
});

export const createSignup = (
	partial: Partial<ChampionshipSignup> = {}
): ChampionshipSignup => ({
	id: createId(),
	entryId: "",
	number: 1,
	personIds: [],
	active: true,
	...partial
});

export const createSubgroup = (
	partial: Partial<ChampionshipSubgroup> = {}
): ChampionshipSubgroup => ({
	id: createId(),
	label: "Gruppe A",
	signupIds: [],
	standings: [],
	closed: false,
	...partial
});

export const createGroup = (
	partial: Partial<ChampionshipGroup> = {}
): ChampionshipGroup => ({
	id: createId(),
	name: "Neue Gruppe",
	mode: "gruppe",
	closed: false,
	signupIds: [],
	subgroups: [createSubgroup()],
	...partial
});

export const createGame = (
	partial: Partial<ChampionshipGame> = {}
): ChampionshipGame => ({
	id: createId(),
	type: "grp",
	gameNr: 1,
	round: 1,
	field: 1,
	pass: 1,
	...partial
});
