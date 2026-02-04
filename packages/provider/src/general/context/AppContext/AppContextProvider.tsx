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
import { Module, PatstoreProject } from "@repo/types";
import {
	generateGraphQLQuery,
	generateGraphQLQuery_4_1,
	sanitizeGraphQlNode
} from "@repo/provider";
import { useQuery } from "@apollo/client";
import ProjectLoader from "./components/ProjectLoader";
import useFindRoles from "./hooks/useFindRoles";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { cloneDeep } from "lodash-es";

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
	const router = useRouter();

	const [currentProject, setCurrentProject] = useState<PatstoreProject>();
	const initialProjectId = useMemo(() => {
		if (typeof window !== "undefined") {
			const localId = Cookies.get(project_id);
			if (localId && projects.includes(localId)) {
				return localId;
			} else {
				return projects[0];
			}
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
				"logo {url name}",
				"data",
				"modules {edges {node {objectId name path icon settings fields {...on Element {value}} categories {...on Element {value}} connected_class sub_menu {...on Element {value}} position data_fields {...on Element {value}} setting_fields {...on Element {value}}}}}"
			];
		} else if (appId === "patflow") {
			return [
				"name",
				"objectId",
				"path",
				"time_settings",
				"record_settings",
				"logo {name url}",
				"data"
			];
		} else return [];
	}, []);

	const { data, loading, error } = useQuery(
		appId === "patstore"
			? generateGraphQLQuery_4_1({
					type: "get",
					objectName: "Project",
					queryName: "project",
					fields: projectFields
				})
			: generateGraphQLQuery_4_1({
					type: "get",
					objectName: "Project",
					queryName: "project",
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
			let project;

			if (appId === "patstore") {
				project = cloneDeep(data.project);

				const modules =
					project?.modules?.edges?.map((edge: { node: Module }) =>
						sanitizeGraphQlNode(edge.node)
					) || undefined;
				if (modules) {
					project["modules"] = modules;
				}
			} else {
				project = data.project;
			}
			setCurrentProject(project);
		}
	}, [data]);

	useEffect(() => {
		if (currentProject) {
			Cookies.set(project_id, currentProject.objectId);
			Cookies.set(project_path, `${currentProject.path}`);
		}
	}, [currentProject]);

	const loadProject = useCallback((projectId: string, initial?: boolean) => {
		router.push("/");
		if (initial) {
			const localId = Cookies.get(project_id);
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
