import { ContentClass, WebpageComponentTable } from "@repo/types";

const createInitialTableData = (
	initialData?: ContentClass["data"]
): WebpageComponentTable => {
	const table =
		initialData && typeof initialData === "object"
			? (initialData as Partial<WebpageComponentTable>)
			: {};

	return {
		columns: table.columns || [],
		rows: table.rows || [],
		settings: table.settings || {
			title: "Neue Tabelle",
			description: "",
			footer: "",
			showHeader: false
		}
	};
};

export default createInitialTableData;
