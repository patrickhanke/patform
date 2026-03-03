import { Filter, FilterOperator, ModuleFilter } from "@repo/types";
import { ColumnDataTypes } from "../../../../types";

export type FilterProps = {
	id: ModuleFilter["id"];
	type: ModuleFilter["type"];
	label: ModuleFilter["label"];
	operator: ModuleFilter["operator"];
	isActive: boolean;
	activeFilter: ModuleFilter["value"];
	toggleFilter: (id: string) => void;
	updateFilterValue: (id: string, value: ModuleFilter["value"]) => void;
};

export type TransformOperatorValueToObject = (T: {
	type: ModuleFilter["type"];
	operator: ModuleFilter["operator"];
	value: ModuleFilter["value"];
}) => string | number | boolean | Date | object | null | undefined;

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

export type StringFilterProps = {
	id: ModuleFilter["id"];
	operator: ModuleFilter["operator"];
	value: ModuleFilter["value"];
	onValueChange: (value: ModuleFilter["value"]) => void;
	onOperatorChange: (operator: ModuleFilter["operator"]) => void;
	hideOperator?: boolean;
};
export type BooleanFilterProps = FilterInputProps;
export type DateFilterProps = FilterInputProps;
export type NumberFilterProps = FilterInputProps;
export type LocationFilterProps = FilterInputProps;
