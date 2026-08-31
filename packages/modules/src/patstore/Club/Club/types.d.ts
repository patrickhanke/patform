import {
	CompetitionClass,
	CompetitionSignup,
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
	competitions: CompetitionClass[];
	refetchCompetitions: () => Promise<unknown>;
	refetchPeople: () => Promise<unknown>;
};

export type ClubTabProps = {
	related: ClubRelatedData;
};

export type ClubSignupRow = CompetitionSignup & {
	objectId: string;
	competitionId: string;
	competitionTitle: string;
	competitionSeason?: string;
	competitionDeadline?: string;
	competitionOpenSignup: boolean;
	competitionFreeSignup: boolean;
	competitionClasses: string[];
};
