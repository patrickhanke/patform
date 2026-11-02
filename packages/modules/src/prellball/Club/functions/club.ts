import { ClubData, ClubSettings, PrellballClubClass } from "@repo/types";

const asRecord = (value: unknown): Record<string, unknown> => {
	if (value && typeof value === "object" && !Array.isArray(value)) {
		return value as Record<string, unknown>;
	}
	return {};
};

export const emptyClubSettings = (): ClubSettings => ({
	contact: "",
	email: "",
	homepage: "",
	short: ""
});

export const emptyClubData = (): ClubData => ({
	training_times: []
});

const asFile = (value: unknown): PrellballClubClass["file"] => {
	if (!value || typeof value !== "object") return null;
	const file = value as { name?: string; url?: string };
	if (!file.name && !file.url) return null;
	return { name: file.name || "", url: file.url || "" };
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
			short: typeof settings.short === "string" ? settings.short : ""
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
	file: club.file ?? { name: "", url: "" },
	settings: club.settings,
	data: club.data,
	categories: club.categories || []
});
