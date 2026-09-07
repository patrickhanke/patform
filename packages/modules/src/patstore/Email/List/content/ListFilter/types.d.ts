import { Filter, Module } from "@repo/types";

export type ListFilterValue = string | boolean;

export type ListFilterItem = {
	key: string;
	value: ListFilterValue;
	id: string;
};

export type FilterFieldInputType = "boolean" | "select" | "text";

export type FilterFieldDefinition = {
	key: string;
	label: string;
	inputType: FilterFieldInputType;
	options?: { label: string; value: string }[];
};

export type EditFilterProps = {
	filters: Filter[];
	onSave: (filters: Filter[]) => void;
	userModule: Module;
};

export type { ListFilterProps } from "./ListFilter";
