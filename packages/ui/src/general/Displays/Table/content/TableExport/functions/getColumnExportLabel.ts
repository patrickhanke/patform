import type { ColumnDef } from "@tanstack/react-table";

export const getColumnExportLabel = <TData, TValue>(
	columnDef: ColumnDef<TData, TValue>
): string => {
	const h = columnDef.header;
	if (typeof h === "string") {
		return h;
	}
	if (typeof h === "number") {
		return String(h);
	}
	return String(columnDef.id ?? columnDef.accessorKey ?? "");
};
