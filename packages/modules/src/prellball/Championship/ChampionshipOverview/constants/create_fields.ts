import { ChampionshipClass, ModuleField } from "@repo/types";
import {
	emptyChampionshipData,
	emptySettings
} from "../../functions/normalize";

export const championshipCreateFields: ModuleField[] = [
	{
		id: "title",
		label: "Titel",
		required: true,
		type: "string",
		active: true,
		position: 0,
		default: true,
		hidden: false
	},
	{
		id: "categories",
		label: "Saison",
		required: true,
		type: "category",
		active: true,
		position: 1,
		default: true,
		hidden: false
	},
	{
		id: "categories",
		label: "Wettkampf",
		required: true,
		type: "category",
		active: true,
		position: 1,
		default: true,
		hidden: false
	}
];

export const championshipInitialData = {
	text: "",
	documents: [] as string[],
	gallery: [] as string[],
	categories: [] as string[],
	category: "",
	short: "",
	group_mode: false,
	secondary_teams: false,
	settings: emptySettings(),
	data: emptyChampionshipData()
};
