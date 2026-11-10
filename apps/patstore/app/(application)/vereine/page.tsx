import { ClubOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/vereine",
	fallbackTitle: "Vereine",
	Overview: ClubOverview
});
