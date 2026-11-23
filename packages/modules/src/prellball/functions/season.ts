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

/** A season runs from 1 July through 30 June of the following year. */
export const seasonStartYear = (date = new Date()) => {
	const month = date.getMonth();
	const day = date.getDate();
	const year = date.getFullYear();
	const inNewSeason = month > 6 || (month === 6 && day >= 1);
	return inNewSeason ? year : year - 1;
};

const seasonYears = (title: string) => {
	const match = title.match(/(20\d{2})\s*[/–-]\s*(20\d{2}|\d{2})/);
	if (!match?.[1] || !match[2]) return null;
	const start = Number(match[1]);
	const end =
		match[2].length === 2
			? Math.floor(start / 100) * 100 + Number(match[2])
			: Number(match[2]);
	return { start, end };
};

/** Season category whose July–June window contains `date`. */
export const currentSeasonId = (
	seasons: { objectId: string; title?: string }[],
	date = new Date()
) => {
	const start = seasonStartYear(date);
	return (
		seasons.find((season) => {
			const years = seasonYears(season.title || "");
			return years?.start === start && years.end === start + 1;
		})?.objectId || ""
	);
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
