import { ResultsOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/championships",
	fallbackTitle: "Ergebnisse",
	Overview: ResultsOverview
});
