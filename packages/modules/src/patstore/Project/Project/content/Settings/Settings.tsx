"use client";

import { Form, usePageData } from "@repo/ui";
import { FC } from "react";
import fields from "../../constants/fields";
import { SettingsProps } from "./types";

const Settings: FC<SettingsProps> = ({ project }) => {
	const { data, setData } = usePageData(
		{
			initialData: {
				name: project.name,
				logo: {
					__type: "File",
					url: project?.logo?.url,
					name: project?.logo?.name
				},
				data: project.data
			},
			objectId: project.objectId
		},
		{
			className: "Project",
			updateObject: (values) => values,
			message: "Daten wurden erfolgreich aktualisiert."
		}
	);

	console.log(data);

	return (
		<Form
			fields={fields}
			isHorizontal
			apiClass="Project"
			data={data ?? undefined}
			formSubmitHandler={(values) => {
				Object.keys(values).forEach((key) => {
					setData(key, values[key]);
				});
			}}
			useWithDebounce
			enableReinitialize
		/>
	);
};

export default Settings;
