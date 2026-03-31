import type { ColumnDef, RowData } from "@tanstack/react-table";

/** Matches TanStack’s effective column id when only `ColumnDef[]` is available. */
export const resolveColumnDefId = <TData extends RowData>(
	def: ColumnDef<TData, unknown>,
	fallbackIndex: number
): string => {
	if (def.id != null && def.id !== "") {
		return String(def.id);
	}
	if ("accessorKey" in def && def.accessorKey != null) {
		return String(def.accessorKey);
	}
	return `column_${fallbackIndex}`;
};
