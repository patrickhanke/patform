import { Dispatch, SetStateAction } from "react";
import { ColumnData, ColumnDataTypes } from "../../types";
import { Filter, FilterOperator } from "@repo/types";

export type FilterOperator = FilterOperator;

export type FilterValue = string | number | boolean | Date | null;

export type TableFilter = Filter & {
	columnId: string;
	columnLabel: string;
	columnType: ColumnDataTypes;
	isActive: boolean;
};

export type TableFilterProps = {
	filterColumns: (ColumnData<TData> & {
		operator?: string;
		operatorTemplate?: string;
	})[];
	filters: Filter[];
	setFilters: Dispatch<SetStateAction<Filter[]>>;
};

export type FilterRowProps = {
	filter: TableFilter;
	onUpdate: (filter: TableFilter) => void;
	onRemove: (filterId: string) => void;
};

export type FilterOperatorOption = {
	value: FilterOperator;
	label: string;
};

export type FilterTypeConfig = {
	type: ColumnDataTypes;
	operators: FilterOperatorOption[];
	defaultOperator: FilterOperator;
	inputType: "text" | "boolean" | "date" | "number" | "select";
};

export type ColumnInfo = {
	id: string;
	/** GraphQL field name for Filter.key - when from Module filter */
	fieldKey?: string;
	label: string;
	type: ColumnDataTypes;
	/** Fixed operator from Module filter - when set, operator selection is hidden */
	operator?: string;
	operatorTemplate?: string;
};
