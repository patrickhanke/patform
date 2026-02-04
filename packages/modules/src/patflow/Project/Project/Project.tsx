"use client";

import { Form, Page } from "@repo/ui";
import fields from "./constants/fields";
import {
	useAppContext,
	useDataHandler,
	useGetData
} from "@repo/provider";

const Project = () => {
	const { updateData } = useDataHandler();
	const { project } = useAppContext();
	const { data: projectData } = useGetData({
		objectName: "Project",
		fields: ["name", "data", "logo {url name}"],
		id: project?.objectId || "",
		skip: !project?.objectId
	});

	if (!projectData) {
		return <div>Loading...</div>;
	}

	console.log(projectData);

	return (
		<Page title="Projektverwaltung">
			<Form
				fields={fields}
				isHorizontal
				apiClass="Project"
				data={{
					data: projectData?.data,
					name: projectData?.name,
					logo: projectData?.logo
				}}
				formSubmitHandler={(values) => {
					updateData({
						className: "Project",
						objectId: project?.objectId,
						updateObject: values,
						feedback: "Daten wurden erfolgreich aktualisiert."
					});
				}}
			/>
		</Page>
	);
};

export default Project;
