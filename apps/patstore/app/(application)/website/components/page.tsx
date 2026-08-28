import { WebsiteComponents } from "@repo/modules";
import { createModuleOverviewPage } from "../../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/website",
	fallbackTitle: "Webseite - Komponenten",
	Overview: WebsiteComponents
});
