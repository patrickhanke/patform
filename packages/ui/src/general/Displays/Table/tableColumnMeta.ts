import type { RowData } from "@tanstack/react-table";

export {};

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData extends RowData, _TValue> {
		/** When the column uses JSX in `accessorFn`, provide a string for CSV/PDF export. */
		exportValue?: (row: TData) => string;
		/** Optional column title in the export dialog (when `header` is not a plain string). */
		exportLabel?: string;
	}
}
