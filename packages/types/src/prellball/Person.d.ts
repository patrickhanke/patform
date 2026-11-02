export type PrellballClubGames = {
	games: string[];
};

/** Club id → games played for that club in one season. */
export type PrellballSeasonGames = {
	[clubId: string]: PrellballClubGames | undefined;
};

/**
 * Prellball fields on Person.data.
 * Played games: `data[season][clubId].games`.
 * Referee games: `data.referee`.
 */
export type PrellballPersonData = {
	username?: string;
	dtb_id?: string;
	birth_date?: string;
	id_confirmed?: boolean;
	club_id?: string;
	referee?: string[];
	[season: string]:
		| string
		| boolean
		| string[]
		| PrellballSeasonGames
		| undefined;
};
