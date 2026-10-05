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
				logo: project.logo,
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
