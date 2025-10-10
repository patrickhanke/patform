import { FileUploader, SlideIn, TextInput } from "@repo/ui";
import React, { FC, useCallback, useState } from "react";
import { CreateProjectProps } from "./types";
import { useDataHandler } from "@repo/provider";

const initialProject = {
	name: "",
	description: ""
};

const CreateProject: FC<CreateProjectProps> = ({
	createProject,
	setCreateProject
}) => {
	const createData = useDataHandler(true, false);;

	const [project, setProject] = useState<typeof initialProject>({
		name: "",
		description: ""
	});

	const createProjectHandler = useCallback(() => {}, [project]);

	return (
		<>
			<SlideIn
				isOpen={createProject}
				cancel={() => setCreateProject(false)}
				header="Neues Projekt"
				confirm={() => setCreateProject(false)}
				preventClickOutside
			>
				<div>
					<h2>Neues Projekt</h2>

					<div>
						<label htmlFor="name">Name</label>

						<TextInput
							onChange={(value) =>
								setProject({ ...project, name: value })
							}
							placeholder="Name"
							id="name"
						/>

						<input type="file" />
					</div>
				</div>
			</SlideIn>
		</>
	);
};

export default CreateProject;
