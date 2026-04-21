import { ModuleFilter } from "@repo/types";

const property_tasks_filters: ModuleFilter[] = [
	{
		id: "title",
		field: "title",
		type: "string",
		operator: "matchesRegex",
		label: "Title"
	},
	{
		id: "description",
		field: "description",
		type: "string",
		operator: "matchesRegex",
		label: "Description"
	},
	{
		id: "assigned_staff",
		field: "assigned_staff",
		type: "id",
		operator: "in",
		label: "Mitarbeiter",
		options: {
			class_name: "User",
			search_path: "objectId"
		}
	},
	{
		id: "state",
		field: "state",
		type: "string",
		operator: "in",
		label: "State",
		options: {
			type: "select",
			select_options: [
				{ label: "Erstellt", value: "created" },
				{ label: "Zugewiesen", value: "assigned" },
				{ label: "Ausgeführt", value: "executed" },
				{ label: "Abgeschlossen", value: "completed" },
				{ label: "Archiviert", value: "archived" }
			],
			fixed: true
		}
	}
];

export default property_tasks_filters;
