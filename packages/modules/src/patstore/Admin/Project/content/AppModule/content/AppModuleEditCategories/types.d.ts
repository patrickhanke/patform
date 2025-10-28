import { Updater } from "use-immer";
import { ModuleCategory } from "@repo/types";

export type AppModuleEditCategorysProps = {
	initialCategories: ModuleCategory[];
	moduleId: string;
	projectId: string;
	moduleName?: string;
};

export type AppModuleCategoryProps = {
	category: ModuleCategory;
	setActiveCategory: (C: string) => void;
};

export type AppModuleEditCategoryProps = {
	category?: ModuleCategory;
	setCategory: Updater<Category[]>;
	projectId: string;
};
