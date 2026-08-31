import { CompetitionOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/competitions",
	fallbackTitle: "Meisterschaften",
	Overview: CompetitionOverview
});
