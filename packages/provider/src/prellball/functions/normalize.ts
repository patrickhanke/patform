import {
	ChampionshipClass,
	ChampionshipData,
	ChampionshipSettings
} from "@repo/types";
import { ChampionshipPageModel } from "../types";

const asRecord = (value: unknown): Record<string, unknown> => {
	if (typeof value === "string") {
		try {
			const parsed = JSON.parse(value) as unknown;
			if (
				parsed &&
				typeof parsed === "object" &&
				!Array.isArray(parsed)
			) {
				return parsed as Record<string, unknown>;
			}
		} catch {
			return {};
		}
	}
	if (value && typeof value === "object" && !Array.isArray(value)) {
		return value as Record<string, unknown>;
	}
	return {};
};

const asStringArray = (value: unknown): string[] => {
	if (!Array.isArray(value)) return [];
	return value
		.map((item) => {
			if (typeof item === "string") return item;
			if (item && typeof item === "object" && "value" in item) {
				return String((item as { value: unknown }).value ?? "");
			}
			return "";
		})
		.filter(Boolean);
};

const asArray = <T>(value: unknown): T[] =>
	Array.isArray(value) ? (value as T[]) : [];

export const emptySettings = (): ChampionshipSettings => ({
	deadline: "",
	show_division: false,
	ak_games: false,
	staff_lead_id: "",
	email: "",
	open_signup: false
});

const asSignUps = (value: unknown): ChampionshipData["sign_ups"] =>
	asArray<ChampionshipData["sign_ups"][number] & { class?: string }>(
		value
	).map((signup) => {
		const legacyDivision = signup.class;
		return {
			...signup,
			division: signup.division || legacyDivision || ""
		};
	});

export const emptyChampionshipData = (): ChampionshipData => ({
	match_days: [],
	sign_ups: [],
	groups: [],
	games: [],
	division: []
});

export const normalizeChampionship = (
	value: ChampionshipClass | null
): ChampionshipPageModel | null => {
	if (!value?.objectId) return null;
	const settings = asRecord(value.settings);
	const data = asRecord(value.data);

	return {
		...value,
		title: value.title || "",
		text: value.text || "",
		documents: asStringArray(
			(value as { documents?: unknown; downloads?: unknown }).documents ||
				(value as { downloads?: unknown }).downloads
		),
		gallery: asStringArray(value.gallery),
		category: value.category || "",
		short: value.short || "",
		slug: value.slug || "",
		group_mode: Boolean(value.group_mode),
		secondary_teams: Boolean(value.secondary_teams),
		settings: {
			deadline:
				typeof settings.deadline === "string" ? settings.deadline : "",
			show_division: Boolean(
				settings.show_division ?? settings.show_class
			),
			ak_games: Boolean(settings.ak_games),
			staff_lead_id:
				typeof settings.staff_lead_id === "string"
					? settings.staff_lead_id
					: "",
			email: typeof settings.email === "string" ? settings.email : "",
			open_signup: Boolean(settings.open_signup),
			max_consecutive_passes:
				typeof settings.max_consecutive_passes === "number"
					? settings.max_consecutive_passes
					: undefined
		},
		data: {
			match_days: asArray(data.match_days),
			sign_ups: asSignUps(data.sign_ups),
			groups: asArray(data.groups),
			games: asArray(data.games),
			division: asStringArray(
				data.division ?? (value as { classes?: unknown }).classes
			)
		},
		person_drafts: {}
	};
};
