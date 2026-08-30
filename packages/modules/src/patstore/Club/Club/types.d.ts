import {
	ChampionshipClass,
	ChampionshipSignup,
	ClubClass,
	GroupClass,
	LocationClass,
	PersonClass
} from "@repo/types";

export type ClubRelatedData = {
	clubs: ClubClass[];
	people: PersonClass[];
	locations: LocationClass[];
	groups: GroupClass[];
	championships: ChampionshipClass[];
	refetchChampionships: () => Promise<unknown>;
	refetchPeople: () => Promise<unknown>;
};

export type ClubTabProps = {
	related: ClubRelatedData;
};

export type ClubSignupRow = ChampionshipSignup & {
	objectId: string;
	championshipId: string;
	championshipTitle: string;
	championshipSeason?: string;
	championshipDeadline?: string;
	championshipOpenSignup: boolean;
	championshipFreeSignup: boolean;
	championshipClasses: string[];
};
