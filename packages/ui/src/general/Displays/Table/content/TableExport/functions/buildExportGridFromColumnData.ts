import type { RowData } from "@tanstack/react-table";
import type { ColumnData } from "../../../types";
import type {
	ExportColumnDescriptor,
	TableExportGrid
} from "./buildExportGridFromTableData";
import { axiosclient, getDateString } from "@repo/provider";

export const stringifyColumnDataValue = async <TData extends RowData>(
	row: TData,
	col: ColumnData<TData>
): Promise<string> => {
	console.log(row);
	console.log(col);
	const raw = row[col.id as keyof TData];
	if (col.id === "image" && raw) {
		const image = await axiosclient().post("/functions/query_class", {
			class_name: "Image",
			id: raw,
			fields: ["file"]
		});
		return image?.data?.result?.object?.file?.url;
	}
	if (raw == null) {
		return "";
	}
	if (typeof raw === "string") {
		return raw;
	}
	if (typeof raw === "number" || typeof raw === "boolean") {
		return String(raw);
	}
	if (raw instanceof Date) {
		return getDateString(raw).dateTime;
	}
	if (Array.isArray(raw)) {
		return raw
			.map((x) =>
				typeof x === "object" && x !== null
					? JSON.stringify(x)
					: String(x)
			)
			.join(", ");
	}
	if (typeof raw === "object") {
		return JSON.stringify(raw);
	}
	return String(raw);
};

export const getExportColumnDescriptorsFromColumnData = <TData extends RowData>(
	columns: ColumnData<TData>[]
): ExportColumnDescriptor[] => {
	return columns.map((col) => ({
		id: String(col.id),
		label: col.label
	}));
};

/**
 * Builds CSV/PDF grids from {@link ColumnData} field metadata (same shape as `useCreateColumns` input).
 */
export const buildExportGridFromColumnData = async <TData extends RowData>(
	columns: ColumnData<TData>[],
	selectedRowData: TData[],
	options?: {
		columnIds?: string[];
	}
): Promise<TableExportGrid> => {
	const descriptors = getExportColumnDescriptorsFromColumnData(columns);
	const byId = new Map(columns.map((col) => [String(col.id), col] as const));

	const orderedIds = options?.columnIds?.length
		? options.columnIds.filter((id) => byId.has(id))
		: descriptors.map((d) => d.id);

	const labelById = new Map(descriptors.map((d) => [d.id, d.label]));
	const headerRow = orderedIds.map((id) => labelById.get(id) ?? id);

	const rows = await Promise.all(
		selectedRowData.map(async (row) => {
			return await Promise.all(
				orderedIds.map(async (id) => {
					const col = byId.get(id);
					if (!col) {
						return "";
					}
					const value = await stringifyColumnDataValue(row, col);
					return value;
				})
			);
		})
	);

	return {
		headers: [headerRow],
		rows
	};
};
