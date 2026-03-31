import type { RowData } from "@tanstack/react-table";
import type { ColumnData } from "../../types";

export type TableExportProps<TData extends RowData> = {
	/** Field metadata aligned with `useCreateColumns` / `generateColumnsFromFields` (`ColumnData`). */
	columns: ColumnData<TData>[];
	/** Rows to export (only selected rows), same shape as `Table` row data. */
	selectedRowData: TData[];
};
