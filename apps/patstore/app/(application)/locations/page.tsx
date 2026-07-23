import { LocationOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/locations",
	fallbackTitle: "Orte",
	Overview: LocationOverview
});
