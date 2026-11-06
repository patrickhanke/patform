import {
	ChampionshipData,
	ChampionshipGame,
	ChampionshipGroup,
	ChampionshipSignUp,
	ClubClass
} from "@repo/types";
import {
	DivisionCategory,
	divisionKey,
	divisionShort
} from "../functions/divisions";
import { createId } from "./ids";

export const signupLabel = (
	signup: ChampionshipSignUp,
	signups: ChampionshipSignUp[],
	clubs: ClubClass[],
	showDivision: boolean,
	divisions: DivisionCategory[] = []
) => {
	const club = clubs.find((item) => item.objectId === signup.club_id);
	if (!club) return "Kein Verein";
	const sameClub = signups.filter(
		(item) =>
			item.club_id === signup.club_id && item.division === signup.division
	);
	const base =
		sameClub.length > 1 && signup.number > 0
			? `${club.settings?.short || club.title} ${signup.number}`
			: club.title;
	const divisionName = divisionShort(signup.division, divisions);
	return showDivision && divisionName ? `${base} - ${divisionName}` : base;
};

const STATUS_RANK: Record<ChampionshipSignUp["status"], number> = {
	gemeldet: 5,
	eingereicht: 4,
	eingeladen: 3,
	erstellt: 2,
	abgelehnt: 1,
	none: 0
};

const teamSlot = (
	signup: ChampionshipSignUp,
	signups: ChampionshipSignUp[],
	divisions: DivisionCategory[]
) => {
	if (signup.number > 0) return signup.number;
	const division = divisionKey(signup.division, divisions);
	const numbers = [
		...new Set(
			signups
				.filter(
					(item) =>
						item.club_id === signup.club_id &&
						item.number > 0 &&
						divisionKey(item.division, divisions) === division
				)
				.map((item) => item.number)
		)
	];
	return numbers.length === 1 ? numbers[0] : 0;
};

/** Same club, same class, same team number. Class short codes and category ids count as one class. */
export const signupTeamKey = (
	signup: ChampionshipSignUp,
	signups: ChampionshipSignUp[],
	divisions: DivisionCategory[] = []
) =>
	`${signup.club_id || ""}|${divisionKey(signup.division, divisions)}|${teamSlot(signup, signups, divisions)}`;

const signupScore = (signup: ChampionshipSignUp) =>
	(signup.person_ids?.length || 0) * 100 + (STATUS_RANK[signup.status] ?? 0);

/** One signup per club and team when the same team was stored under two class ids. */
export const distinctClubSignups = (
	signups: ChampionshipSignUp[],
	divisions: DivisionCategory[] = []
) => {
	const winners = new Map<string, ChampionshipSignUp>();
	signups.forEach((signup) => {
		if (!signup.club_id) return;
		const key = signupTeamKey(signup, signups, divisions);
		const current = winners.get(key);
		if (!current || signupScore(signup) > signupScore(current)) {
			winners.set(key, signup);
		}
	});
	const ids = new Set([...winners.values()].map((signup) => signup.id));
	return signups.filter((signup) => ids.has(signup.id));
};

export const groupClassLabel = (
	group: ChampionshipGroup,
	signups: ChampionshipSignUp[],
	divisions: DivisionCategory[] = []
) => {
	const divisionIds: string[] = [];
	group.subgroups.forEach((subgroup) => {
		subgroup.signup_ids.forEach((signupId) => {
			const signup = signups.find((item) => item.id === signupId);
			if (signup?.division && !divisionIds.includes(signup.division)) {
				divisionIds.push(signup.division);
			}
		});
	});
	if (divisionIds.length > 3) return "mixed";
	if (divisionIds.length === 0) return "—";
	return divisionIds
		.map((value) => divisionShort(value, divisions) || value)
		.join(", ");
};

export const createSignup = (
	division: string,
	position: number
): ChampionshipSignUp => ({
	id: createId(),
	division,
	status: "erstellt",
	active: true,
	number: 0,
	position,
	person_ids: [],
	coach_ids: [],
	referee_ids: []
});

export const nextSubgroupLabel = (group: ChampionshipGroup) => {
	const number = String(group.subgroups.length + 1).padStart(2, "0");
	return `Gruppe ${number}`;
};

export const withoutSignup = (
	data: ChampionshipData,
	signupId: string
): ChampionshipData => ({
	...data,
	sign_ups: data.sign_ups.filter((signup) => signup.id !== signupId),
	groups: data.groups.map((group) => ({
		...group,
		subgroups: group.subgroups.map((subgroup) => ({
			...subgroup,
			signup_ids: subgroup.signup_ids.filter((id) => id !== signupId)
		}))
	}))
});

export const clearSignupClub = (
	data: ChampionshipData,
	signupId: string
): ChampionshipData => ({
	...data,
	sign_ups: data.sign_ups.map((signup) =>
		signup.id === signupId
			? {
					...signup,
					club_id: "",
					status: "erstellt",
					number: 0,
					person_ids: [],
					coach_ids: [],
					referee_ids: [],
					captain_id: "",
					comment: ""
				}
			: signup
	),
	groups: data.groups.map((group) => ({
		...group,
		subgroups: group.subgroups.map((subgroup) => ({
			...subgroup,
			signup_ids: subgroup.signup_ids.filter((id) => id !== signupId)
		}))
	}))
});

export const clubNumber = (
	signups: ChampionshipSignUp[],
	clubId: string,
	division: string,
	signupId: string
) => {
	const matches = signups.filter(
		(signup) =>
			signup.id !== signupId &&
			signup.club_id === clubId &&
			signup.division === division
	);
	return matches.length + 1;
};

export const createGame = (
	partial: Partial<ChampionshipGame> = {}
): ChampionshipGame => ({
	id: createId(),
	type: "grp",
	game_nr: 1,
	round: 1,
	field: 1,
	pass: 1,
	...partial
});
