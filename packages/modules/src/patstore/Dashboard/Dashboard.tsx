"use client";

import { Divider, HtmlContent, InfoBox, Page } from "@repo/ui";
import { useAppContext } from "@repo/provider";

const Dashboard = () => {
	const { project } = useAppContext();
	const dashboardContent = project?.data?.dashboard?.content;

	return (
		<Page title="Dashboard">
			<div>
				<InfoBox text="Nach dem Speichern eines Eintrages, dauert es einige Minuten bis die Änderungen auf der Webseite erscheinen." />
			</div>
			<Divider />
			{dashboardContent && <HtmlContent content={dashboardContent} />}
		</Page>
	);
};

export default Dashboard;
