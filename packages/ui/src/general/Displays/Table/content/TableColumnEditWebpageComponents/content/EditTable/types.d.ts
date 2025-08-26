import { WebpageComponentTable, WebpageContentTable } from "@repo/types";
import { Dispatch, SetStateAction } from "react";

export type WebpageTable = WebpageContentTable["table"];

export type WebpageTableColumn = WebpageTable["columns"][number];

export type TableType = {
	columns: WebpageComponentTable["columns"];
	rows: WebpageComponentTable["rows"];
	settings: {
		title: string;
		description: string;
		footer: string;
	};
};

export type EditTableProps = {
	initialData: WebpageComponentTable;
	onChange?: (T: WebpageComponentTable) => void;
};

export type EditTableColumnsProps = {
	table: WebpageTable;
	setTable: Dispatch<SetStateAction<WebpageTable>>;
};

export type EditTableSettingsProps = {
	table: WebpageContentTable["table"];
	onChange: (table: WebpageContentTable["table"]) => void;
};

export type EditTableRowsProps = {
	table: WebpageTable;
	onChange?: Dispatch<SetStateAction<WebpageTable>>;
};
