import { Updater } from "use-immer";
import { Field, ModuleFilter } from "@repo/types";

export type { ModuleFilter };

export type AppModuleEditFiltersProps = {
	moduleName: string;
	initialFilters: ModuleFilter[];
	moduleId: string;
	modulePath: Module["path"];
	modules: { value: string; label: string; connected_class: string }[];
	settingsFields: Field[];
	dataFields: Field[];
	additionnalFields?: { value: string; label: string; search_path: string }[];
};

export type AppModuleFilterProps = {
	filter: ModuleFilter;
	setActiveFilter: (id: string) => void;
	deleteFilter: (id: string) => void;
};

export type AppModuleEditFilterProps = {
	filter?: ModuleFilter;
	setFilters: Updater<ModuleFilter[]>;
	modulePath: Module["path"];
	modules: { value: string; label: string; connected_class: string }[];
	settingsFields: Field[];
	dataFields: Field[];
	additionnalFields?: { value: string; label: string; search_path: string }[];
};
