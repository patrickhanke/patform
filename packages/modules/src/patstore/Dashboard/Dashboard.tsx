"use client";

import { Divider, HtmlContent, InfoBox, Page } from "@repo/ui";
import { useAppContext } from "@repo/provider";

const Dashboard = () => {
	const { project } = useAppContext();

	console.log(project);
	const dashboardContent = project?.data?.dashboard?.content;
	return (
		<Page title="Dashboard">
			<div>
				<InfoBox text="Bis Änderungen auf der Webseite erscheinen, dauert es einige Minuten bis die Änderungen in der Datenbank übernommen werden." />
			</div>
			<Divider />
			{dashboardContent && <HtmlContent content={dashboardContent} />}
		</Page>
	);
};

export default Dashboard;
