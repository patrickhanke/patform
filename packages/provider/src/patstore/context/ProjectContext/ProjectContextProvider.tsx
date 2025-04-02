"use client";

import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { ProjectContext } from "./ProjectContext";
import { PatstoreProject } from "@repo/types";
import { generateGraphQLQuery } from "@repo/provider";
import { useQuery } from "@apollo/client";
import ProjectLoader from "./components/ProjectLoader";

const ProjectContextProvider = ({
	projects,
	children
}: {
	projects: string[];
	children: ReactNode;
}) => {
	const [currentProject, setCurrentProject] = useState<PatstoreProject>();
	const initialProjectId = useMemo(() => {
		if (typeof window !== "undefined") {
			const localId = localStorage.getItem("patstore_project_id");
			return localId ? localId : projects[0];
		}
		return projects[0];
	}, [projects]);

	const [projectId, setProjectId] = useState<string | null | undefined>(
		initialProjectId
	);

	const { data, loading, error } = useQuery(
		generateGraphQLQuery({
			type: "get",
			objectName: "Project",
			fields: [
				"objectId",
				"name",
				"path",
				"logo",
				"modules {results {objectId name path icon settings fields categories connected_class}}"
			]
		}),
		{
			variables: {
				id: projectId
			},
			skip: !projectId
		}
	);

	useEffect(() => {
		if (data) {
			setCurrentProject(data.objects.getProject);
		}
	}, [data]);

	useEffect(() => {
		if (currentProject) {
			localStorage.setItem(
				"patstore_project_id",
				currentProject.objectId
			);
			localStorage.setItem(
				"patstore_project_path",
				`/${currentProject.path}`
			);
		}
	}, [currentProject]);

	const loadProject = useCallback((projectId: string, initial?: boolean) => {
		if (initial) {
			const localId = localStorage.getItem("patstore_project_id");
			if (localId) {
				setProjectId(localId);
			} else {
				setProjectId(projectId);
			}
		}
		setProjectId(projectId);
	}, []);

	const projectContextObject = useMemo(
		() => ({
			project: currentProject,
			loadProject
		}),
		[currentProject]
	);

	return (
		<ProjectContext.Provider value={projectContextObject}>
			<ProjectLoader
				loading={loading}
				error={error}
				project={currentProject}
			/>
			{children}
		</ProjectContext.Provider>
	);
};

export default ProjectContextProvider;
