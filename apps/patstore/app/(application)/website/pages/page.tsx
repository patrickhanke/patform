import { WebsitesOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/website",
	fallbackTitle: "Webseite",
	Overview: WebsitesOverview
});
