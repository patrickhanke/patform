"use client";

import {
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState
} from "react";
import { AppContext } from "./AppContext";
import { PatstoreProject } from "@repo/types";
import { generateGraphQLQuery } from "@repo/provider";
import { useQuery } from "@apollo/client";
import ProjectLoader from "./components/ProjectLoader";
import useFindRoles from "./hooks/useFindRoles";

const ProjectContextProvider = ({
	projects,
	children
}: {
	projects: string[];
	children: ReactNode;
}) => {
	const appId = process.env.APP_NAME as string;
	const project_id = `${appId}_project_id`;
	const project_path = `${appId}_project_path`;

	const [currentProject, setCurrentProject] = useState<PatstoreProject>();
	const initialProjectId = useMemo(() => {
		if (typeof window !== "undefined") {
			const localId = localStorage.getItem(project_id);
			return localId ? localId : projects[0];
		}
		return projects[0];
	}, [projects]);

	const [projectId, setProjectId] = useState<string | null | undefined>(
		initialProjectId
	);

	const projectFields = useMemo(() => {
		if (appId === "patstore") {
			return [
				"objectId",
				"name",
				"path",
				"logo",
				"modules {results {objectId name path icon settings fields categories connected_class sub_menu position}}"
			];
		} else if (appId === "patflow") {
			return [
				"name",
				"objectId",
				"path",
				"time_settings",
				"record_settings"
			];
		} else return [];
	}, []);

	const { data, loading, error } = useQuery(
		generateGraphQLQuery({
			type: "get",
			objectName: "Project",
			fields: projectFields
		}),
		{
			variables: {
				id: projectId
			},
			skip: !projectId
		}
	);

	const { roles } = useFindRoles({
		appId,
		projectId: currentProject?.objectId
	});

	useEffect(() => {
		if (data) {
			setCurrentProject(data.objects.getProject);
		}
	}, [data]);

	useEffect(() => {
		if (currentProject) {
			localStorage.setItem(project_id, currentProject.objectId);
			localStorage.setItem(project_path, `${currentProject.path}`);
		}
	}, [currentProject]);

	const loadProject = useCallback((projectId: string, initial?: boolean) => {
		if (initial) {
			const localId = localStorage.getItem(project_id);
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
			loadProject,
			roles
		}),
		[currentProject, roles]
	);

	return (
		<AppContext.Provider value={projectContextObject}>
			<ProjectLoader
				loading={loading}
				error={error}
				project={currentProject}
				appId={appId}
			/>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error(
			"useAppContext must be used within a ProjectContextProvider"
		);
	}
	return context;
};

export default ProjectContextProvider;
