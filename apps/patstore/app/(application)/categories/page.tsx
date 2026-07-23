import { CategoriesOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/categories",
	fallbackTitle: "Kategorien",
	Overview: CategoriesOverview
});
