import {
	ChampionshipClass,
	ChampionshipGame,
	ChampionshipGroup,
	ChampionshipSignup,
	EventClass,
	NewsClass,
	PersonClass
} from "@repo/types";

export type ChampionshipRelatedData = {
	entries: NewsClass[];
	events: EventClass[];
	people: PersonClass[];
};

export type ChampionshipTabProps = {
	championship: ChampionshipClass;
	related: ChampionshipRelatedData;
	onUpdate: (
		patch: Partial<ChampionshipClass>,
		feedback?: string
	) => Promise<void>;
	loading: boolean;
};

export type ChampionshipGameRow = ChampionshipGame & {
	objectId: string;
};

export type ChampionshipSignupRow = ChampionshipSignup & {
	objectId: string;
};

export type ChampionshipGroupRow = ChampionshipGroup & {
	objectId: string;
};
