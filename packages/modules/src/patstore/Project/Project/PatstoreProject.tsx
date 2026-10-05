"use client";

import { Page } from "@repo/ui";
import { useAppContext, useGetData } from "@repo/provider";
import page_states from "./constants/page_states";
import { useState } from "react";
import { Colors, Dashboard, Settings } from "./content";
import { PatstoreProject } from "@repo/types";

const Project = () => {
	const { project } = useAppContext();
	const [activePage, setActivePage] = useState<(typeof page_states)[number]>(
		page_states[0]
	);
	const { data, refetch } = useGetData({
		objectName: "Project",
		fields: ["objectId", "name", "data", "settings", "logo {url name}"],
		id: project?.objectId,
		skip: !project?.objectId
	});

	const projectData = data as PatstoreProject | null;

	if (!projectData) {
		return <div>Loading...</div>;
	}

	return (
		<Page
			title="Projektverwaltung"
			pageStates={[...page_states]}
			pageState={activePage}
			setPageState={setActivePage}
			refetch={refetch}
		>
			{activePage?.value === "settings" && (
				<Settings project={projectData} />
			)}
			{activePage?.value === "dashboard" && (
				<Dashboard project={projectData} />
			)}
			{activePage?.value === "colors" && <Colors project={projectData} />}
		</Page>
	);
};

export default Project;
