import { FC, useCallback, useMemo } from "react";
import { Field, SlideInForm } from "@repo/ui";
import { useDataHandler } from "@repo/provider";
import { AddProjectProps } from "../types";
import { FormikValues } from "formik";

const AddProject: FC<AddProjectProps> = ({ addProject, setAddProject }) => {
	const { createData } = useDataHandler();

	const formFields = useMemo(
		() => [
			{
				label: `Name`,
				id: "name",
				name: "name",
				type: "input",
				placeholder: "Projektname"
			} as Field,
			{
				label: `Beschreibung`,
				id: "description",
				name: "description",
				type: "textarea",
				dataType: "string",
				placeholder: "Projektbeschreibung"
			},
			{
				label: "Logo",
				type: "image_upload",
				name: "logo",
				dataType: "string",
				options: {
					return_type: "string"
				}
			}
		],
		[]
	);

	const createProjectHandler = useCallback(async (data: FormikValues) => {
		if (data.name) {
			await createData({
				className: "Project",
				updateObject: data
			});
		}

		setAddProject(false);
		window.location.reload();
	}, []);

	return (
		<SlideInForm
			isOpen={addProject}
			setIsOpen={() => setAddProject(false)}
			fields={formFields as Field[]}
			title="Projekt erstellen"
			dataHandler={createProjectHandler}
		/>
	);
};

export default AddProject;
