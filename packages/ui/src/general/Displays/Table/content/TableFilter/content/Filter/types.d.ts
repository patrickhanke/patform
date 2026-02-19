import { Filter, FilterOperator } from "@repo/types";
import { ColumnDataTypes } from "../../../../types";

export type ExtendedFilter = Filter & {
	columnType: ColumnDataTypes;
	columnLabel: string;
};

export type FilterInputProps = {
	filter: ExtendedFilter;
	onValueChange: (value: Filter["value"]) => void;
	onOperatorChange: (operator: FilterOperator) => void;
	/** When true, hide operator selection - operator is fixed from Module */
	hideOperator?: boolean;
};

export type StringFilterProps = FilterInputProps;
export type BooleanFilterProps = FilterInputProps;
export type DateFilterProps = FilterInputProps;
export type NumberFilterProps = FilterInputProps;
export type LocationFilterProps = FilterInputProps;
