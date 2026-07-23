import { FormsOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/forms",
	fallbackTitle: "Formulare",
	Overview: FormsOverview
});
