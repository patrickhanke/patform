import { Dispatch, SetStateAction } from "react";
import { Filter, ModuleCategory } from "@repo/types";

export type FilterInputFields = {
	type: "input";
	key: string;
	operator: Filter["operator"];
	value: string;
	placeholder?: string;
};

export type FilterSelectField = {
	type: "select";
	key: string;
	value: string;
	options: { label: string; value: string }[];
	placeholder: string;
};

export type RenderFiltersProps = {
	categories: ModuleCategory[];
	filters: Filter[];
	initialFilters: Filter[];
	fields: (FilterSelectFields | FilterInputFields)[];
	setFilters: Dispatch<SetStateAction<Filter[]>>;
};

export type FilterSelectProps = {
	category: ModuleCategory;
	filters: Filter[];
	setFilters: Dispatch<SetStateAction<Filter[]>>;
};
