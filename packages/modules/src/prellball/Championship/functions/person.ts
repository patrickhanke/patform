import {
	PersonClass,
	PrellballPersonData,
	PrellballSeasonGames
} from "@repo/types";

export const readPersonData = (person?: PersonClass): PrellballPersonData => {
	const raw = person?.data;
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
	return raw as PrellballPersonData;
};

export const mergedPersonData = (
	person: PersonClass | undefined,
	drafts: Record<string, PrellballPersonData>
): PrellballPersonData => ({
	...readPersonData(person),
	...(person ? drafts[person.objectId] : {})
});

const isSeasonGames = (value: unknown): value is PrellballSeasonGames =>
	Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const seasonGameIds = (
	data: PrellballPersonData,
	season: string
): string[] => {
	if (!season) return [];
	const seasonEntry = data[season];
	if (!isSeasonGames(seasonEntry)) return [];
	const ids = new Set<string>();
	Object.values(seasonEntry).forEach((club) => {
		club?.games?.forEach((gameId) => ids.add(gameId));
	});
	return [...ids];
};

export const playedGameCount = (data: PrellballPersonData, season: string) =>
	seasonGameIds(data, season).length;

export const playerPlayedGame = (
	data: PrellballPersonData,
	season: string,
	clubId: string,
	gameId: string
) => {
	if (!season || !clubId) return false;
	const seasonEntry = data[season];
	if (!isSeasonGames(seasonEntry)) return false;
	return Boolean(seasonEntry[clubId]?.games?.includes(gameId));
};

export const withPlayedGame = (
	data: PrellballPersonData,
	season: string,
	clubId: string,
	gameId: string,
	played: boolean
): PrellballPersonData => {
	const current = isSeasonGames(data[season]) ? data[season] : {};
	const games = new Set(current[clubId]?.games || []);
	if (played) games.add(gameId);
	else games.delete(gameId);
	return {
		...data,
		[season]: {
			...current,
			[clubId]: { games: [...games] }
		}
	};
};

export const refereePersonId = (
	people: PersonClass[],
	drafts: Record<string, PrellballPersonData>,
	gameId: string
) =>
	people.find((person) =>
		(mergedPersonData(person, drafts).referee || []).includes(gameId)
	)?.objectId || "";

export const withRefereeGame = (
	data: PrellballPersonData,
	gameId: string,
	isReferee: boolean
): PrellballPersonData => {
	const games = new Set(data.referee || []);
	if (isReferee) games.add(gameId);
	else games.delete(gameId);
	return {
		...data,
		referee: [...games]
	};
};
