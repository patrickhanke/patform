import { WebpageComponentTable } from "@repo/types";

const createInitialTableData = (
	initialData: WebpageComponentTable
): WebpageComponentTable => {
	return {
		columns: initialData?.columns || [],
		rows: initialData?.rows || [],
		settings: initialData?.settings || {
			title: "Neue Tabelle",
			description: "",
			footer: "",
			showHeader: false
		}
	} as WebpageComponentTable;
};

export default createInitialTableData;
