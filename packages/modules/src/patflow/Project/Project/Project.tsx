"use client";

import { Form, Page } from "@repo/ui";
import fields from "./constants/fields";
import { useQuery } from "@apollo/client";
import {
	generateGraphQLQuery,
	useAppContext,
	useDataHandler
} from "@repo/provider";

const Project = () => {
	const { updateData } = useDataHandler();
	const { project } = useAppContext();
	const { data } = useQuery(
		generateGraphQLQuery({
			objectName: "Project",
			type: "get",
			fields: ["name", "data", "logo {url name}"]
		}),
		{
			variables: {
				id: project?.objectId
			},
			skip: !project?.objectId
		}
	);

	if (!data?.objects.getProject) {
		return <div>Loading...</div>;
	}

	const projectData = data?.objects.getProject;

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
