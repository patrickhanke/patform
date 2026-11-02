import { PrellballClubOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/vereine",
	fallbackTitle: "Vereine",
	Overview: PrellballClubOverview
});
