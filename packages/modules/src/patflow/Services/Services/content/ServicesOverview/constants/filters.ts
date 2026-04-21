import { ModuleFilter } from "@repo/types";

const filter_columns: ModuleFilter[] = [
	{
		field: "title",
		operator: "matchesRegex",
		type: "string",
		id: "title",
		label: "Name"
	},
	{
		field: "property",
		operator: "have",
		type: "pointer",
		id: "property",
		label: "property",
		options: {
			class_name: "Property",
			search_path: "id"
		}
	}
];

export default filter_columns;
