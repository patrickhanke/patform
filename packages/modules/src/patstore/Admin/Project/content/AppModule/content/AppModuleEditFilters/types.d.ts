import { Updater } from "use-immer";
import { ModuleFilter, ModuleFilterPath, ModulePath } from "@repo/types";
import { AdditionalField } from "../../types";
import { Field } from "@repo/ui";

export type { ModuleFilter, ModuleFilterPath };

export type AppModuleEditFiltersProps = {
	moduleName: string;
	initialFilters: ModuleFilter[];
	moduleId: string;
	modulePath: ModulePath;
	modules: { value: string; label: string; connected_class: string }[];
	settingsFields: Field[];
	dataFields: Field[];
	additionnalFields?: AdditionalField[];
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
	additionnalFields?: AdditionalField[];
};

export type CreateOptionsProps = {
	filter: ModuleFilter;
	changeHandler: (
		keys: ModuleFilterPath[],
		value: ModuleFilter[keyof ModuleFilter][]
	) => void;
};
