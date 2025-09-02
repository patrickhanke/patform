"use client";

import { InfoBox, Page } from "@repo/ui";
import { deleteAllNotifications } from "@repo/provider";
import { useMemo } from "react";

const Dashboard = () => {
	const pageHeaderButtons = useMemo(
		() => [
			{
				text: "Neue Nachricht",
				onClick: () => deleteAllNotifications(),
				value: "new_message"
			}
		],
		[]
	);

	return (
		<Page title="Dashboard" pageHeaderButtons={pageHeaderButtons}>
			<div>
				<InfoBox text="Bis Änderungen auf der Webseite erscheinen, dauert es einige Minuten bis die Änderungen in der Datenbank übernommen werden." />
			</div>
		</Page>
	);
};

export default Dashboard;
