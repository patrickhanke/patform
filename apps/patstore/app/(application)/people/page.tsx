import { PersonsOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/people",
	fallbackTitle: "Personen",
	Overview: PersonsOverview
});
