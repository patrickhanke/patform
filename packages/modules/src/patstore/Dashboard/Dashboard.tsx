"use client";

import { Divider, HtmlContent, InfoBox, Page } from "@repo/ui";
import { useAppContext } from "@repo/provider";

const Dashboard = () => {
	const { project } = useAppContext();
	const dashboardContent = project?.data?.dashboard?.content;

	return (
		<Page title="Dashboard">
			<div className="flex col gap-md">
				<InfoBox
					status="info"
					maxWidth="100%"
					content={() => (
						<div>
							<h3>Update 1.1.1</h3>
							<p>
								Liebe Nutzerinnen und Nutzer, mit dem Update auf
								die Version 1.1.1 haben wurden einige Funktionen
								für die Bearbeitung von Inhalten geändert.
							</p>
							<Divider />
							<h3>1. Erstellen eines neues Eintrages</h3>
							<p>
								Ein neuer Eintrag wird nach wie vor über den
								Button oben rechts auf der Seite erstellt.
							</p>
							<p>
								Der Status eines neu erstellten Eintrages ist
								jetzt in der Regel immer &quot;Entwurf&quot;.
								Dieser wird erst dann auf der Webseite
								angezeigt, wenn er veröffentlicht wird.
							</p>
							<Divider />
							<h3>2. Änderung der Speicherung von Einträgen</h3>
							<p>
								Das Speichern von Einträgen erfolgt jetzt nicht
								mehr mit der Änderung des entsprechenden Feldes
								in der Tabelle, sondern erfolgt über eine
								entsprechende Aktiosleiste. Über diese kann
								können die Eingaben rückgängig gemacht,
								verworfern oder gespeichert werden.
							</p>
							<Divider showLine />
							<video
								src={"/patstore_tutorial.mp4"}
								loop
								controls
								autoPlay
							/>
						</div>
					)}
				/>
				<InfoBox
					maxWidth="100%"
					text="Nach dem Speichern eines Eintrages, dauert es einige Minuten bis die Änderungen auf der Webseite erscheinen."
				/>
			</div>
			<Divider />
			{dashboardContent && <HtmlContent content={dashboardContent} />}
		</Page>
	);
};

export default Dashboard;
