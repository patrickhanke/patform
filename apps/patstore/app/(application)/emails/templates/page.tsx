import { EmailTemplatesOverview } from "@repo/modules";
import { createModuleOverviewPage } from "../../createModuleOverviewPage";

export default createModuleOverviewPage({
	modulePath: "/emails",
	fallbackTitle: "Email Vorlagen",
	Overview: EmailTemplatesOverview
});
