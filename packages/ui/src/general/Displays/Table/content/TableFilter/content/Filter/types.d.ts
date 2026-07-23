import { Filter, FilterOperator, ModuleFilter } from "@repo/types";
import { ColumnDataTypes } from "../../../../types";

type FilterValue = ModuleFilter["value"];

export type FilterProps = {
	id: ModuleFilter["id"];
	type: ModuleFilter["type"];
	label: ModuleFilter["label"];
	operator: ModuleFilter["operator"];
	isActive: boolean;
	activeFilter?: Filter;
	toggleFilter: (id: string) => void;
	updateFilterValue: (id: string, value: FilterValue) => void;
	options: ModuleFilter["options"];
};

export type OnValueChange = (value: FilterValue) => void;

export type IdFilterProps = {
	label: string;
	isMulti?: boolean;
	className?: string;
	value: string | string[];
	onValueChange: OnValueChange;
	type: ModuleFilter["type"];
};

export type SearchFilterProps = {
	label: string;
	path: string;
	type: "select" | "input" | "toggle";
	onValueChange: OnValueChange;
	value?: string;
	selectOptions?: { label: string; value: string }[];
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
	onValueChange: OnValueChange;
};

export type SelectFilterProps = {
	label: string;
	selectOptions: { label: string; value: string }[];
	value?: string;
	onChange: (value: string) => void;
};

export type BooleanFilterProps = {
	label: string;
	value?: boolean;
	onChange: (value: boolean) => void;
};
