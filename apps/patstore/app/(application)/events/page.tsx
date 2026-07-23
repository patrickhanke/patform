import { EventOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/events",
	fallbackTitle: "Events",
	Overview: EventOverview
});
