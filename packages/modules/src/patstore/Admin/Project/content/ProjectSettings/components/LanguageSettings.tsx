import React, { useMemo } from "react";
import { Form } from "@repo/ui";
import { ApolloRefetch, PatstoreProject } from "@repo/types";
import { useDataHandler } from "@repo/provider";

const LanguageSettings = ({
	project,
	refetch
}: {
	project: PatstoreProject;
	refetch: ApolloRefetch;
}) => {
	const { updateData } = useDataHandler();
	const formFields = useMemo(() => {
		return [
			{
				id: "languages",
				position: 3,
				name: "settings.languages",
				type: "select",
				label: "Sprachen",
				value: project?.settings?.languages,
				select_options: [
					{ label: "Deutsch", value: "de" },
					{ label: "Englisch", value: "en" }
				],
				isMulti: true,
				dataType: "string",
				width: 240
			},
			{
				id: "default_language",
				position: 3,
				name: "settings.default_language",
				type: "select",
				label: "Standardsprache",
				value: project?.settings?.default_language,
				select_options: [
					{ label: "Deutsch", value: "de", disabled: false },
					{
						label: "Englisch",
						value: "en",
						disabled: !project?.settings?.languages?.includes("en")
					}
				],
				dataType: "string",
				width: 240
			}
		];
	}, [project]);
	return (
		<Form
			fields={formFields}
			data={project}
			formSubmitHandler={async (values) => {
				await updateData({
					className: "Project",
					objectId: projectId,
					updateObject: {
						settings: values
					}
				});
				refetch();
			}}
		/>
	);
};

export default LanguageSettings;
