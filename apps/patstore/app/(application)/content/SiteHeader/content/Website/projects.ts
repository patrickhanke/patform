export type WebsiteProjectKey = "koloproktologie" | "coloproktologen";

// Same project selection as triggerDeployWebhook: koloproktologie is the
// Parse project JRxDkaxCoI, coloproktologen is the project with path "bcd".
export const websiteProjectKey = (project: {
	objectId?: string;
	path?: string;
}): WebsiteProjectKey | null => {
	if (project.objectId === "JRxDkaxCoI") {
		return "koloproktologie";
	}
	if (project.path === "bcd") {
		return "coloproktologen";
	}
	return null;
};
