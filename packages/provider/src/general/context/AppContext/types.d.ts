import {
	PatflowProject,
	PatflowUserRole,
	PatstoreProject,
	PatstoreRoleClass
} from "@repo/types";

// `AppContext` is mounted by both apps. The project and role shapes are not
// interchangeable, so callers pick the app they are running in
// (`useAppContext<"patstore">()` / `useAppContext<"patflow">()`).
export type AppEnvironment = "patstore" | "patflow";

export type ProjectByApp = {
	patstore: PatstoreProject;
	patflow: PatflowProject;
};

export type RoleByApp = {
	patstore: PatstoreRoleClass;
	patflow: PatflowUserRole;
};

// Distributive so `ContextValues<"patstore" | "patflow">` stays a union of
// the two app objects (roles stay a homogeneous array per app).
export type ContextValues<T extends AppEnvironment = AppEnvironment> =
	T extends AppEnvironment
		? {
				// Optimistically non-optional, matching the pre-existing convention:
				// `project` genuinely can be undefined (e.g. a user with no projects),
				// but typing it that way would ripple `| undefined` checks through
				// every consumer that already assumes it's defined.
				project: ProjectByApp[T];
				loadProject: (projectId: string) => void;
				roles: RoleByApp[T][];
			}
		: never;
