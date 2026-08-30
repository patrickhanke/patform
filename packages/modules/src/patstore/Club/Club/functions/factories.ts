import { ClubClass, ClubTrainingTime } from "@repo/types";

export const createId = () => {
	if (typeof crypto !== "undefined" && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

export const createTrainingTime = (
	partial: Partial<ClubTrainingTime> = {}
): ClubTrainingTime => ({
	id: createId(),
	title: "",
	weekday: "",
	startHours: null,
	startMinutes: null,
	endHours: null,
	endMinutes: null,
	contact: true,
	groupIds: [],
	...partial
});

export const normalizeClub = (
	club: ClubClass | null
): ClubClass | null => {
	if (!club) {
		return null;
	}

	return {
		...club,
		contact: club.contact || "",
		email: club.email || "",
		homepage: club.homepage || "",
		logo: club.logo || "",
		short: club.short || "",
		training: club.training ?? [],
		playerIds: club.playerIds ?? []
	};
};
