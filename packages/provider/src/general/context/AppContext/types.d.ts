// `AppContext` is shared between patstore and patflow, whose project/role
// shapes differ (see `PatstoreProject`/`PatflowProject`, `PatstoreRoleClass`/
// `PatflowUserRole`). Kept loosely typed here on purpose; each app's own

import { PatflowProject } from "@repo/types";

// `LayoutContext` is the strongly-typed boundary for its own shape.
export type ContextValues = {
	// Optimistically non-optional, matching the pre-existing convention:
	// `project` genuinely can be undefined (e.g. a user with no projects),
	// but typing it that way would ripple `| undefined` checks through
	// every consumer that already assumes it's defined.
	project: PatflowProject;
	loadProject: (projectId: string) => void;
	roles: PatstoreRoleClass[];
};
