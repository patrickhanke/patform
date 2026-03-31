import type { ColumnDef, RowData } from "@tanstack/react-table";
import { getColumnExportLabel } from "./getColumnExportLabel";
import { getColumnExportValue } from "./getColumnExportValue";
import { resolveColumnDefId } from "./resolveColumnDefId";

export type ExportColumnDescriptor = {
	id: string;
	label: string;
};

/** Shape consumed by `exportTableToCsv` / `exportTableToPdf` (`headers` includes the header row). */
export type TableExportGrid = {
	headers: string[][];
	rows: string[][];
};

const buildColumnDefById = <TData extends RowData>(
	columns: ColumnDef<TData, unknown>[]
): Map<string, ColumnDef<TData, unknown>> => {
	const map = new Map<string, ColumnDef<TData, unknown>>();
	columns.forEach((def, index) => {
		map.set(resolveColumnDefId(def, index), def);
	});
	return map;
};

export const getExportColumnDescriptors = <TData extends RowData>(
	columns: ColumnDef<TData, unknown>[]
): ExportColumnDescriptor[] => {
	return columns.map((def, index) => {
		const id = resolveColumnDefId(def, index);
		const meta = def.meta;
		return {
			id,
			label: meta?.exportLabel ?? getColumnExportLabel(def)
		};
	});
};

/**
 * Turns table column definitions + selected row objects into CSV/PDF-ready header and body rows.
 * Works with any `TData` used by {@link TableTypes} (e.g. module rows, `PersonClass`, etc.).
 */
export const buildExportGridFromTableData = <TData extends RowData>(
	columns: ColumnDef<TData, unknown>[],
	selectedRowData: TData[],
	options?: {
		/** Subset and order of columns; defaults to all columns in definition order. */
		columnIds?: string[];
		/** Row index passed to `accessorFn` (defaults to index within `selectedRowData`). */
		getRowIndexInSource?: (row: TData, indexInSelection: number) => number;
	}
): TableExportGrid => {
	const descriptors = getExportColumnDescriptors(columns);
	const byId = buildColumnDefById(columns);

	const orderedIds = options?.columnIds?.length
		? options.columnIds.filter((id) => byId.has(id))
		: descriptors.map((d) => d.id);

	const labelById = new Map(descriptors.map((d) => [d.id, d.label]));
	const headerRow = orderedIds.map((id) => labelById.get(id) ?? id);

	const rows = selectedRowData.map((row, indexInSelection) => {
		const rowIndex =
			options?.getRowIndexInSource?.(row, indexInSelection) ??
			indexInSelection;
		return orderedIds.map((id) => {
			const def = byId.get(id);
			if (!def) {
				return "";
			}
			return getColumnExportValue(row, def, rowIndex);
		});
	});

	return {
		headers: [headerRow],
		rows
	};
};
