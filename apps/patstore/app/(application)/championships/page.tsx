import { ChampionshipOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/championships",
	fallbackTitle: "Wettkämpfe",
	Overview: ChampionshipOverview
});
