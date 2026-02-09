"use client";

import { Form, Page } from "@repo/ui";
import fields from "./constants/fields";
import { useAppContext, useDataHandler, useGetData } from "@repo/provider";
import page_states from "./constants/page_states";
import { useState } from "react";
import { Dashboard } from "./content";
import { cloneDeep, set } from "lodash-es";

const Project = () => {
	const { updateData } = useDataHandler();
	const { project } = useAppContext();
	const [activePage, setActivePage] = useState<(typeof page_states)[number]>(
		page_states[0]
	);
	const { data: projectData, refetch } = useGetData({
		objectName: "Project",
		fields: ["name", "data", "logo {url name}"],
		id: project?.objectId,
		skip: !project?.objectId
	});

	if (!projectData) {
		return <div>Loading...</div>;
	}

	return (
		<Page
			title="Projektverwaltung"
			pageStates={[...page_states]}
			pageState={activePage}
			setPageState={setActivePage}
		>
			{activePage?.value === "settings" && (
				<Form
					fields={fields}
					isHorizontal
					apiClass="Project"
					data={{
						data: projectData?.data,
						name: projectData?.name,
						logo: projectData?.logo
					}}
					formSubmitHandler={async (values) => {
						await updateData({
							className: "Project",
							objectId: project?.objectId,
							updateObject: values,
							feedback: "Daten wurden erfolgreich aktualisiert."
						});
						await refetch();
					}}
				/>
			)}
			{activePage?.value === "dashboard" && (
				<Dashboard
					content={projectData?.data?.dashboard?.content || ""}
					onChange={async (content) => {
						const pData = cloneDeep(projectData.data);
						set(pData, "dashboard.content", content);

						await updateData({
							className: "Project",
							objectId: project?.objectId,
							updateObject: {
								data: pData
							},
							feedback: "Daten wurden erfolgreich aktualisiert."
						});
						await refetch();
					}}
				/>
			)}
		</Page>
	);
};

export default Project;
