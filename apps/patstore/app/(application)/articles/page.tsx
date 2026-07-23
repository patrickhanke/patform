import { ArticlesOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/articles",
	fallbackTitle: "Beiträge",
	Overview: ArticlesOverview
});
