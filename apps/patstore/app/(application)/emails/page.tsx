import { EmailsOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/emails",
	fallbackTitle: "E-Mails",
	Overview: EmailsOverview
});
