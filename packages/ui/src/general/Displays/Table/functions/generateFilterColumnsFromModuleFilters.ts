import { ModuleFilter } from "@repo/types";
import { ColumnData, ColumnDataTypes } from "../types";

const moduleFilterTypeToColumnType = (moduleType: string): ColumnDataTypes => {
	switch (moduleType) {
		case "String":
			return "string";
		case "Pointer":
		case "Id":
			return "location";
		case "Array":
			return "category";
		case "Date":
			return "date";
		case "Number":
			return "string";
		case "Boolean":
			return "boolean";
		default:
			return "string";
	}
};

/**
 * Converts Module filters to filter columns for Table.
 * Each column has a fixed operator from the Module filter config.
 */
const generateFilterColumnsFromModuleFilters = <T extends object>(
	moduleFilters: ModuleFilter[] = []
): (ColumnData<T> & { operator?: string; operatorTemplate?: string })[] => {
	if (!moduleFilters) return [];

	return moduleFilters.map((filter, index) => ({
		id:
			(filter.id as keyof T) ||
			(`filter-${filter.field}-${index}` as keyof T),
		/** GraphQL field name - used as Filter.key for query */
		accessorKey: filter.field,
		label: filter.label || filter.field,
		type: filter.type as ColumnDataTypes,
		enableSorting: false,
		operator: filter.operator
	}));
};

export default generateFilterColumnsFromModuleFilters;
