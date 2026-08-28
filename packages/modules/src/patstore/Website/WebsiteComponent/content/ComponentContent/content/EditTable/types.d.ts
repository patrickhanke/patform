import { ContentClass, WebpageComponentTable } from "@repo/types";
import { Dispatch, SetStateAction } from "react";

export type WebpageTable = WebpageComponentTable;

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
	initialData?: ContentClass["data"];
	objectId: string;
};

export type EditTableRowsProps = {
	table: WebpageTable;
	onChange?: Dispatch<SetStateAction<WebpageTable>>;
};

export type EditTableColumnProps = {
	column: WebpageTableColumn;
	onChange: (key: "title" | "align", value: string) => void;
};
