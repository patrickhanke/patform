import { ClubData, PrellballClubClass } from "@repo/types";
import { CLUB_CATEGORY_ID, UNION_CATEGORY_ID } from "../constants/categories";

type ClubKind = "club" | "union";

/**
 * A club is a regular club (Verein) when it has the club category.
 * Everything else is treated as a union of two clubs (Spielgemeinschaft).
 */
export const clubKind = (categories?: string[] | null): ClubKind => {
	const list = categories || [];
	if (list.includes(UNION_CATEGORY_ID)) return "union";
	return list.includes(CLUB_CATEGORY_ID) ? "club" : "union";
};

export const isRegularClub = (club: Pick<PrellballClubClass, "categories">) =>
	clubKind(club.categories) === "club";

/** Unions in which the club is the primary or the secondary club. */
export const unionsOfClub = (
	clubs: PrellballClubClass[],
	clubId: string
): PrellballClubClass[] =>
	clubs.filter(
		(item) =>
			item.objectId !== clubId &&
			!isRegularClub(item) &&
			(item.settings?.primary_club_id === clubId ||
				item.settings?.secondary_club_id === clubId)
	);

const asRecord = (value: unknown): Record<string, unknown> => {
	if (value && typeof value === "object" && !Array.isArray(value)) {
		return value as Record<string, unknown>;
	}
	return {};
};

export const emptyClubSettings = (): PrellballClubClass["settings"] => ({
	contact: "",
	email: "",
	homepage: "",
	short: "",
	primary_club_id: "",
	secondary_club_id: ""
});

export const emptyClubData = (): ClubData => ({
	training_times: []
});

const asFile = (value: unknown): PrellballClubClass["file"] => {
	if (!value || typeof value !== "object") return null;
	const file = value as { name?: string; url?: string };
	if (!file.name || !file.url) return null;
	return { __type: "File", name: file.name, url: file.url };
};

export const normalizeClub = (
	value: PrellballClubClass | null
): PrellballClubClass | null => {
	if (!value?.objectId) return null;
	const settings = asRecord(value.settings);
	const data = asRecord(value.data);
	return {
		...value,
		title: value.title || "",
		categories: value.categories || [],
		file: asFile(value.file),
		settings: {
			contact:
				typeof settings.contact === "string" ? settings.contact : "",
			email: typeof settings.email === "string" ? settings.email : "",
			homepage:
				typeof settings.homepage === "string" ? settings.homepage : "",
			short: typeof settings.short === "string" ? settings.short : "",
			primary_club_id:
				typeof settings.primary_club_id === "string"
					? settings.primary_club_id
					: "",
			secondary_club_id:
				typeof settings.secondary_club_id === "string"
					? settings.secondary_club_id
					: ""
		},
		data: {
			training_times: Array.isArray(data.training_times)
				? data.training_times
				: []
		}
	};
};

export const clubUpdateObject = (club: PrellballClubClass) => ({
	title: club.title,
	label: club.title,
	file: club.file ?? null,
	settings: club.settings,
	data: club.data,
	categories: club.categories || []
});
