import { ImagesOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/images",
	fallbackTitle: "Bilder",
	Overview: ImagesOverview
});
