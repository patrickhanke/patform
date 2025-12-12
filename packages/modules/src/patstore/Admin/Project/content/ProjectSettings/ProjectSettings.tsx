"use client";

import { useQuery } from "@apollo/client";
import get_project_settings from "./constants/get_project_settings";
import { Field, Form } from "@repo/ui";
import { useDataHandler } from "@repo/provider";
import { useMemo } from "react";

const ProjectSettings = ({ projectId }: { projectId: string }) => {
	const { data, loading, error, refetch } = useQuery(get_project_settings, {
		variables: { id: projectId }
	});
	const { updateData } = useDataHandler(true, false);;

	const settingsFields: Field[] = useMemo(() => {
		if (data) {
			const project = data?.objects.getProject;

			return [
				{
					id: "name",
					position: 1,
					name: "name",
					type: "input",
					label: "Name",
					value: project.name,
					validation: {
						required: "Pflichtfeld",
						min_length: 5,
						max_length: 36
					}
				},
				{
					id: "logo",
					position: 2,
					name: "logo",
					type: "image_upload",
					label: "Logo",
					value: project.logo,
					options: { max_file_count: 1, return_type: "string" }
				},
				{
					id: "email",
					position: 3,
					name: "settings.email",
					type: "input",
					label: "E-Mail",
					value: project?.settings?.email
					// options: { max_file_count: 1, return_type: "string" }
				}
			];
		} else {
			return [];
		}
	}, [data]);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error...</p>;

	const project = data?.objects.getProject;

	return (
		<Form
			fields={settingsFields}
			data={project}
			formSubmitHandler={async (values) => {
				await updateData({
					className: "Project",
					objectId: project?.objectId,
					updateObject: {
						name: values.name,
						logo: values?.logo,
						settings: values.settings
					},
					feedback: "Projekt aktualisiert"
				});

				refetch();
			}}
			useWithDebounce
			enableReinitialize
			isHorizontal
		/>
	);
};

export default ProjectSettings;
