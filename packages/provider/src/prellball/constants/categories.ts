import { ChampionshipCategory } from "@repo/types";

export const championshipCategories: {
	value: ChampionshipCategory;
	label: string;
}[] = [
	{ value: "Meisterschaften", label: "Meisterschaften" },
	{ value: "Bundesliga", label: "Bundesliga" },
	{ value: "Regionalmeisterschaften", label: "Regionalmeisterschaften" },
	{ value: "Turniere", label: "Turniere" }
];
