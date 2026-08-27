import {
	ApolloRefetch,
	Field,
	ModuleFilter,
	ModuleFilterPath,
	ModulePath
} from "@repo/types";
import { type PageDataUpdateOptions } from "@repo/ui";
import { AdditionalField } from "../../types";

export type { ModuleFilter, ModuleFilterPath };

export type ModuleFiltersPageData = {
	filters: ModuleFilter[];
};

export type AppModuleEditFiltersProps = {
	objectId: string;
	initialFilters: ModuleFilter[];
	modulePath: ModulePath;
	modules: { value: string; label: string; connected_class: string }[];
	settingsFields: Field[];
	dataFields: Field[];
	additionnalFields?: AdditionalField[];
	updateOptions: PageDataUpdateOptions<ModuleFiltersPageData>;
	refetch: ApolloRefetch;
};

export type AppModuleFilterProps = {
	filter: ModuleFilter;
	setActiveFilter: (id: string) => void;
	deleteFilter: (id: string) => void;
};

export type AppModuleEditFilterProps = {
	filter: ModuleFilter;
	onChange: (filter: ModuleFilter) => void;
	modulePath: ModulePath;
	modules: { value: string; label: string; connected_class: string }[];
	settingsFields: Field[];
	dataFields: Field[];
	additionnalFields?: AdditionalField[];
};

export type CreateOptionsProps = {
	filter: ModuleFilter;
	changeHandler: (keys: ModuleFilterPath[], value: unknown[]) => void;
};
