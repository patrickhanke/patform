import { GroupOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/groups",
	fallbackTitle: "Gruppen",
	Overview: GroupOverview
});
