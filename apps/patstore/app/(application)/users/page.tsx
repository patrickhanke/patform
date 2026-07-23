import { UsersOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/users",
	fallbackTitle: "Nutzer",
	Overview: UsersOverview
});
