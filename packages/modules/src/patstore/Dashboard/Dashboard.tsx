"use client";

import { InfoBox, Page } from "@repo/ui";

const Dashboard = () => {
	return (
		<Page title="Dashboard">
			<div>
				<InfoBox text="Bis Änderungen auf der Webseite erscheinen, dauert es einige Minuten bis die Änderungen in der Datenbank übernommen werden." />
			</div>
		</Page>
	);
};

export default Dashboard;
