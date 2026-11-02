import { CategoryClass } from "@repo/types";

export const seasonCategoryId = (
	recordCategories: string[] | undefined,
	seasons: CategoryClass[]
) => {
	const ids = new Set(seasons.map((season) => season.objectId));
	return (recordCategories || []).find((id) => ids.has(id)) || "";
};

export const seasonCategoryTitle = (
	recordCategories: string[] | undefined,
	seasons: CategoryClass[]
) => {
	const id = seasonCategoryId(recordCategories, seasons);
	return seasons.find((season) => season.objectId === id)?.title || "—";
};

export const withSeasonCategory = (
	recordCategories: string[] | undefined,
	seasons: CategoryClass[],
	nextSeasonId: string
) => {
	const ids = new Set(seasons.map((season) => season.objectId));
	const rest = (recordCategories || []).filter((id) => !ids.has(id));
	return nextSeasonId ? [...rest, nextSeasonId] : rest;
};
