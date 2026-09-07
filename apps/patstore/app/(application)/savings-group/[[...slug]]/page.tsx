import { SavingsGroup } from "@repo/modules";
import { createModuleOverviewPage } from "../../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/savings-group",
	fallbackTitle: "Sparclub",
	Overview: SavingsGroup
});
