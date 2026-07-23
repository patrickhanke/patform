import { CalendarOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/calendar",
	fallbackTitle: "Kalender",
	Overview: CalendarOverview
});
