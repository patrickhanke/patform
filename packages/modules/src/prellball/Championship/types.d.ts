import {
	ArticleClass,
	ChampionshipClass,
	ClubClass,
	DownloadClass,
	LocationClass,
	PatstoreUser,
	PersonClass,
	PrellballPersonData
} from "@repo/types";

/** Page document. `person_drafts` is saved onto Person.data, not onto Championship. */
export type ChampionshipPageModel = ChampionshipClass & {
	person_drafts: Record<string, PrellballPersonData>;
};

export type ChampionshipTabProps = {
	related: ChampionshipRelatedData;
};

export type ChampionshipRelatedData = {
	clubs: ClubClass[];
	locations: LocationClass[];
	people: PersonClass[];
	articles: ArticleClass[];
	downloads: DownloadClass[];
	users: PatstoreUser[];
	refetchPeople: () => Promise<unknown>;
};
