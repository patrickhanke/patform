import { ModuleField } from "@repo/types";

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
	contact: "",
	email: "",
	homepage: "",
	logo: "",
	short: "",
	training: [] as unknown[],
	playerIds: [] as string[]
};
