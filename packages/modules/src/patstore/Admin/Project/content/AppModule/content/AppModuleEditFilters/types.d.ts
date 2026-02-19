import { Updater } from "use-immer";
import { ModuleFilter } from "@repo/types";

export type { ModuleFilter };

export type AppModuleEditFiltersProps = {
	initialFilters: ModuleFilter[];
	moduleId: string;
};

export type AppModuleFilterProps = {
	filter: ModuleFilter;
	setActiveFilter: (id: string) => void;
	deleteFilter: (id: string) => void;
};

export type AppModuleEditFilterProps = {
	filter?: ModuleFilter;
	setFilters: Updater<ModuleFilter[]>;
};
