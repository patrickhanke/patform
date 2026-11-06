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

const matchesDivision = (item: DivisionCategory, id: string) =>
	item.objectId === id || item.description?.toLowerCase() === id.toLowerCase();

export const findDivision = (
	id: string | undefined,
	divisions: DivisionCategory[]
) => {
	if (!id) return undefined;
	return divisions.find((item) => matchesDivision(item, id));
};

/** Category objectId for a stored division, whether that value is an id or a short code. */
export const divisionKey = (
	id: string | undefined,
	divisions: DivisionCategory[]
) => findDivision(id, divisions)?.objectId || id || "";

export const divisionShort = (
	id: string | undefined,
	divisions: DivisionCategory[]
) => {
	const match = findDivision(id, divisions);
	if (!match) return "";
	return match.title || match.label || "";
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
