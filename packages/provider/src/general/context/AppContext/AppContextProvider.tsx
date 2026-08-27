"use client";

import { ReactNode, useCallback, useContext, useEffect, useMemo } from "react";
import { AppContext } from "./AppContext";
import { ContextValues } from "./types";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// `project` and `roles` are now fetched server-side (in the app's layout)
// and handed down as props, instead of being loaded here via a client-side
// Apollo query. That removes the window where `project`/`roles` are
// undefined on first render. Switching the active project still goes
// through this provider (`loadProject`), it just triggers a server refetch
// via `router.refresh()` instead of an in-place Apollo refetch.
//
// Kept loosely typed: patstore and patflow pass their own project/role
// shapes (`PatstoreProject`/`PatflowProject`, `PatstoreRoleClass`/
// `PatflowUserRole`) into this shared provider.
const ProjectContextProvider = ({
	project,
	roles = [],
	children
}: {
	project?: Record<string, any>;
	roles?: Record<string, any>[];
	children: ReactNode;
}) => {
	const appId = process.env.APP_NAME as string;
	const project_id = `${appId}_project_id`;
	const project_path = `${appId}_project_path`;
	const router = useRouter();

	// Keep the cookie in sync so middleware and the next server render pick
	// up the same project (e.g. after a fresh login with no cookie yet).
	useEffect(() => {
		if (project?.objectId) {
			Cookies.set(project_id, project.objectId);
			Cookies.set(project_path, `${project.path}`);
		}
	}, [project, project_id, project_path]);

	const loadProject = useCallback(
		(projectId: string) => {
			Cookies.set(project_id, projectId);
			router.push("/");
			router.refresh();
		},
		[project_id, router]
	);

	// `project` is genuinely undefined for a user with no projects (rare);
	// cast rather than widen `ContextValues.project` (see its definition).
	const projectContextObject = useMemo(
		() =>
			({
				project,
				loadProject,
				roles
			}) as ContextValues,
		[project, roles, loadProject]
	);

	return (
		<AppContext.Provider value={projectContextObject}>
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
