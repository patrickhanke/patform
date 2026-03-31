import type { ColumnDef, RowData } from "@tanstack/react-table";
import { get } from "lodash-es";
import { isValidElement } from "react";

const stringifyPrimitive = (value: unknown): string => {
	if (value == null) {
		return "";
	}
	if (
		typeof value === "string" ||
		typeof value === "number" ||
		typeof value === "boolean"
	) {
		return String(value);
	}
	if (Array.isArray(value)) {
		return value.map(stringifyPrimitive).join(", ");
	}
	return "";
};

export const getColumnExportValue = <TData extends RowData>(
	row: TData,
	columnDef: ColumnDef<TData, unknown>,
	rowIndex: number
): string => {
	const meta = columnDef.meta;
	if (meta?.exportValue) {
		return meta.exportValue(row);
	}
	if ("accessorKey" in columnDef && columnDef.accessorKey) {
		const v = get(row, columnDef.accessorKey as string);
		return stringifyPrimitive(v);
	}
	if (columnDef.accessorFn) {
		const v = columnDef.accessorFn(row, rowIndex);
		if (isValidElement(v)) {
			return "";
		}
		return stringifyPrimitive(v);
	}
	return "";
};
