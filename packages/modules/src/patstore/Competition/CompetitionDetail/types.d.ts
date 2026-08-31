import {
	CompetitionClass,
	CompetitionGame,
	CompetitionGroup,
	CompetitionSignup,
	ClubClass,
	EventClass,
	PersonClass
} from "@repo/types";

export type CompetitionRelatedData = {
	clubs: ClubClass[];
	events: EventClass[];
	people: PersonClass[];
};

export type CompetitionTabProps = {
	Competition: CompetitionClass;
	related: CompetitionRelatedData;
	onUpdate: (
		patch: Partial<CompetitionClass>,
		feedback?: string
	) => Promise<void>;
	loading: boolean;
};

export type CompetitionGameRow = CompetitionGame & {
	objectId: string;
};

export type CompetitionSignupRow = CompetitionSignup & {
	objectId: string;
};

export type CompetitionGroupRow = CompetitionGroup & {
	objectId: string;
};
