import { ModuleFilter } from "@repo/types";

const filter_columns: ModuleFilter[] = [
	{
		field: "name",
		operator: "matchesRegex",
		type: "string",
		id: "name",
		label: "Name"
	},
	{
		field: "properties",
		operator: "have",
		type: "pointer",
		id: "properties",
		label: "Properties",
		options: {
			class_name: "Property",
			search_path: "name"
		}
	}
];

export default filter_columns;
