import {
	ChampionshipData,
	ChampionshipGame,
	ChampionshipGroup,
	ChampionshipSignUp,
	ClubClass
} from "@repo/types";
import { DivisionCategory, divisionShort } from "../functions/divisions";
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
