import { ClassCategories, ModuleCategory } from "@repo/types";

export type WebsitePageCategoriesProps = {
	category: ModuleCategory;
	categories: ClassCategories;
	isEditable: boolean;
	onChange: (categories: string[]) => Promise<void>;
};

export type WebsitePageDocumentsProps = {
	documents: ClassCategories;
	isEditable: boolean;
	onChange: (categories: string[]) => Promise<void>;
};
