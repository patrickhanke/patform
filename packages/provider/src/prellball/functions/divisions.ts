import { CategoryClass } from "@repo/types";

/** Category records whose `category_id` is a championship division. */
export const DIVISION_CATEGORY_ID = "9ea6655e-2063-48f0-ae36-ca442d67978f";

export type DivisionCategory = Pick<
	CategoryClass,
	"objectId" | "title" | "label" | "description"
> & {
	key?: string;
	category_id?: string;
};

export const divisionLabel = (
	id: string | undefined,
	divisions: DivisionCategory[]
) => {
	if (!id) return "";
	const match = divisions.find((item) => item.objectId === id);
	return match?.title || match?.label || id;
};

export const divisionShort = (
	id: string | undefined,
	divisions: DivisionCategory[]
) => {
	if (!id) return "";
	const match = divisions.find(
		(item) => item.description.toLowerCase() === id.toLowerCase()
	);
	if (!match) return "";
	return match.title || "";
};

export const selectedDivisionIds = (
	recordCategories: string[] | undefined,
	divisions: DivisionCategory[]
) => {
	const selected = new Set(recordCategories || []);
	return divisions
		.filter((item) => selected.has(item.objectId))
		.map((item) => item.objectId);
};

export const withDivisionCategories = (
	recordCategories: string[] | undefined,
	divisions: DivisionCategory[],
	nextIds: string[]
) => {
	const ids = new Set(divisions.map((item) => item.objectId));
	const rest = (recordCategories || []).filter((id) => !ids.has(id));
	const uniqueNext = nextIds.filter(
		(id, index) => nextIds.indexOf(id) === index && ids.has(id)
	);
	return [...rest, ...uniqueNext];
};
