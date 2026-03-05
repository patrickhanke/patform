import { Filter, FilterOperator, ModuleFilter } from "@repo/types";
import { Field } from "@repo/ui";
import { ColumnDataTypes } from "../../../../types";

export type FilterProps = {
	id: ModuleFilter["id"];
	type: ModuleFilter["type"];
	label: ModuleFilter["label"];
	operator: ModuleFilter["operator"];
	isActive: boolean;
	activeFilter?: Filter;
	toggleFilter: (id: string) => void;
	updateFilterValue: (id: string, value: ModuleFilter["value"]) => void;
	options: ModuleFilter["options"];
};

export type OnValueChange = (value: string | string[] | object) => void;

export type IdFilterProps = {
	label: string;
	isMulti?: boolean;
	className?: string;
	value: string | string[];
	onValueChange: (value: string | string[]) => void;
	type: ModuleFilter["type"];
};

export type SearchFilterProps = {
	label: string;
	path: string;
	type: Field["type"];
	onValueChange: OnValueChange;
	value?: string;
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
	onValueChange: (value: ModuleFilter["value"]) => void;
	options: ModuleFilter["options"];
};
export type BooleanFilterProps = FilterInputProps;
export type DateFilterProps = FilterInputProps;
export type NumberFilterProps = FilterInputProps;
export type LocationFilterProps = FilterInputProps;
