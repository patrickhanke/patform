import { DownloadsOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/downloads",
	fallbackTitle: "Downloads",
	Overview: DownloadsOverview
});
