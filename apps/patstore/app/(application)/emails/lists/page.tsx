import { ListsOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/emails",
	fallbackTitle: "E-Mail Listen",
	Overview: ListsOverview
});
