import { ChampionshipGame } from "@repo/types";

export const sortGames = (games: ChampionshipGame[]): ChampionshipGame[] =>
	[...games].sort((a, b) => {
		if (a.pass !== b.pass) {
			return a.pass - b.pass;
		}
		if (a.field !== b.field) {
			return a.field - b.field;
		}
		return a.gameNr - b.gameNr;
	});

export const renumberGames = (games: ChampionshipGame[]): ChampionshipGame[] =>
	sortGames(games).map((game, index) => ({
		...game,
		gameNr: index + 1
	}));
