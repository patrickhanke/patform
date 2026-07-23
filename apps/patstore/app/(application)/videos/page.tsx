import { VideosOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/videos",
	fallbackTitle: "Videos",
	Overview: VideosOverview
});
