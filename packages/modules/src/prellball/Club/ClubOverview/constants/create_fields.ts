import { ModuleField } from "@repo/types";
import { emptyClubData, emptyClubSettings } from "../../functions/club";

export const clubCreateFields: ModuleField[] = [
	{
		id: "title",
		label: "Name",
		required: true,
		type: "string",
		active: true,
		position: 0,
		default: true,
		hidden: false
	}
];

export const clubInitialData = {
	settings: emptyClubSettings(),
	data: emptyClubData(),
	categories: [] as string[],
	file: null
};
