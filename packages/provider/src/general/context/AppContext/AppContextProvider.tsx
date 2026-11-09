"use client";

import {
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo
} from "react";
import { PatflowProject, PatstoreProject } from "@repo/types";
import { AppContext } from "./AppContext";
import {
	AppEnvironment,
	ContextValues,
	ProjectByApp,
	RoleByApp
} from "./types";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// `project` and `roles` are fetched server-side (in the app's layout) and
// handed down as props. Switching the active project still goes through
// this provider (`loadProject`); it triggers a server refetch via
// `router.refresh()`.
//
// The project prop selects the app: a `PatstoreProject` pairs with
// `PatstoreRoleClass`, a `PatflowProject` with `PatflowUserRole`.
// `useAppContext<"patstore">()` / `useAppContext<"patflow">()` reads that
// shape back out. The running app is `process.env.APP_NAME`.
type RoleForProject<TProject> = [TProject] extends [PatstoreProject]
	? RoleByApp["patstore"]
	: [TProject] extends [PatflowProject]
		? RoleByApp["patflow"]
		: RoleByApp[AppEnvironment];

type AppContextProviderProps<
	TProject extends PatstoreProject | PatflowProject
> = {
	project?: TProject;
	roles?: RoleForProject<TProject>[];
	children: ReactNode;
};

function ProjectContextProvider<
	TProject extends PatstoreProject | PatflowProject
>({
	project,
	roles = [],
	children
}: AppContextProviderProps<TProject>) {
	// patflow: cookie keys come from next.config (`PROJECT_ID` / `PROJECT_PATH`).
	// patstore: falls back to `${APP_NAME}_project_id` / `_project_path`, which
	// matches layout.tsx and proxy.ts.
	const appName = process.env.APP_NAME;
	const isPatflow = appName === "patflow";
	const project_id = process.env.PROJECT_ID ?? `${appName}_project_id`;
	const project_path = process.env.PROJECT_PATH ?? `${appName}_project_path`;
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

	const projectContextObject = useMemo((): ContextValues => {
		if (isPatflow) {
			return {
				project: project as ProjectByApp["patflow"],
				loadProject,
				roles: roles as RoleByApp["patflow"][]
			};
		}

		return {
			project: project as ProjectByApp["patstore"],
			loadProject,
			roles: roles as RoleByApp["patstore"][]
		};
	}, [isPatflow, project, roles, loadProject]);

	return (
		<AppContext.Provider value={projectContextObject}>
			{children}
		</AppContext.Provider>
	);
}

export const useAppContext = <
	T extends AppEnvironment = AppEnvironment
>(): ContextValues<T> => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error(
			"useAppContext must be used within a ProjectContextProvider"
		);
	}
	return context as ContextValues<T>;
};

export default ProjectContextProvider;
