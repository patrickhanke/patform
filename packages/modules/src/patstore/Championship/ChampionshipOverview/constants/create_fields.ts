import { ModuleField } from "@repo/types";

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
	}
];

export const championshipInitialData = {
	season: "",
	show_class: false,
	ak_games: false,
	open_signup: false,
	free_signup: false,
	secondary_teams: false,
	group_mode: false,
	classes: [] as string[],
	gallery: [] as string[],
	matchdays: [] as unknown[],
	signups: [] as unknown[],
	groups: [] as unknown[],
	games: [] as unknown[],
	info: "",
	email: ""
};
