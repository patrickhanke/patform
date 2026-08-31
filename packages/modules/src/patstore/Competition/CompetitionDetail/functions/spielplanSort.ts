import { CompetitionGame } from "@repo/types";

export const sortGames = (games: CompetitionGame[]): CompetitionGame[] =>
	[...games].sort((a, b) => {
		if (a.pass !== b.pass) {
			return a.pass - b.pass;
		}
		if (a.field !== b.field) {
			return a.field - b.field;
		}
		return a.gameNr - b.gameNr;
	});

export const renumberGames = (games: CompetitionGame[]): CompetitionGame[] =>
	sortGames(games).map((game, index) => ({
		...game,
		gameNr: index + 1
	}));
