import { ChampionshipPageModel } from "../types";

export const championshipUpdateObject = (page: ChampionshipPageModel) => ({
	title: page.title,
	text: page.text || "",
	documents: page.documents || [],
	gallery: page.gallery || [],
	categories: page.categories || [],
	category: page.category || "",
	short: page.short || "",
	group_mode: page.group_mode,
	secondary_teams: page.secondary_teams,
	settings: page.settings,
	data: page.data
});
