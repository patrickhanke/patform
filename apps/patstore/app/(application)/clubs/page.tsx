import { ClubOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/clubs",
	fallbackTitle: "Vereine",
	Overview: ClubOverview
});
