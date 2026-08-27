import { ApolloRefetch, ModuleCategory } from "@repo/types";
import { type PageDataUpdateOptions } from "@repo/ui";

export type ModuleCategoriesPageData = {
	categories: ModuleCategory[];
};

export type AppModuleEditCategorysProps = {
	objectId: string;
	initialCategories: ModuleCategory[];
	projectId: string;
	updateOptions: PageDataUpdateOptions<ModuleCategoriesPageData>;
	refetch: ApolloRefetch;
};

export type AppModuleCategoryProps = {
	category: ModuleCategory;
	setActiveCategory: (id: string) => void;
	deleteCategory: (id: string) => void;
};

export type AppModuleEditCategoryProps = {
	category: ModuleCategory;
	onChange: (category: ModuleCategory) => void;
	projectId: string;
};
