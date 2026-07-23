import { NewsOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/entries",
	fallbackTitle: "News",
	Overview: NewsOverview
});
