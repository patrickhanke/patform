import type { ColumnData } from "@repo/ui";
import type { Service } from "@repo/types";

export const serviceExportColumns: ColumnData<Service>[] = [
	{ id: "name", label: "Name", type: "string", enableSorting: true },
	{
		id: "description",
		label: "Beschreibung",
		type: "string",
		enableSorting: true
	},
	{ id: "properties", label: "Objekte", type: "string", enableSorting: true },
	{ id: "is_active", label: "Aktiv", type: "boolean", enableSorting: true }
];
