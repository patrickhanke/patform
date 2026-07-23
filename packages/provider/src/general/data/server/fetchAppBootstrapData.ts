import { cloneDeep } from "lodash-es";
import { Module } from "@repo/types";
import { sanitizeGraphQlNode } from "../../Apollo/functions/helpers";

// Plain server-side helpers (no "use client", no React) so layouts and pages
// can fetch the project/module data that used to live behind a client-side
// Apollo query. Import these only from Server Components.

const MODULE_FIELDS = `
	objectId
	name
	path
	icon
	settings
	fields { ...on Element { value } }
	categories { ...on Element { value } }
	connected_class
	sub_menu { ...on Element { value } }
	position
	data_fields { ...on Element { value } }
	setting_fields { ...on Element { value } }
	filters { ...on Element { value } }
`;

const PROJECT_FIELDS: Record<string, string> = {
	patstore: `
		objectId
		name
		path
		logo { url name }
		data
		settings
		modules {
			edges {
				node {
					${MODULE_FIELDS}
				}
			}
		}
	`,
	patflow: `
		name
		objectId
		path
		time_settings
		record_settings
		logo { name url }
		data
	`
};

const ROLE_FIELDS: Record<string, string> = {
	patstore: `
		objectId
		name
		users { edges { node { objectId username } } }
		default
		modules { ...on Element { value } }
		color
		title
	`,
	patflow: `
		objectId
		name
	`
};

type AppId = "patstore" | "patflow";

async function graphqlFetch({
	query,
	variables,
	sessionToken
}: {
	query: string;
	variables?: Record<string, unknown>;
	sessionToken?: string;
}) {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		"X-Parse-Application-Id": process.env.SASHIDO_APP_ID || "",
		"X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY || ""
	};

	if (sessionToken) {
		headers["X-Parse-Session-Token"] = sessionToken;
	}

	const response = await fetch(process.env.SASHIDO_GQL_URL as string, {
		method: "POST",
		headers,
		body: JSON.stringify({ query, variables }),
		cache: "no-store"
	});

	const json = await response.json();

	if (json.errors) {
		console.error("fetchAppBootstrapData GraphQL errors:", json.errors);
	}

	return json.data;
}

// Resolves which project should be active for the current request: the
// cookie-selected project if the user still has access to it, otherwise the
// user's first project. Uses the same `users/me` REST call the layout
// already makes, so Next.js request memoization dedupes it into one fetch.
export async function resolveActiveProjectId({
	sessionToken,
	cookieProjectId
}: {
	sessionToken?: string;
	cookieProjectId?: string;
}): Promise<string | undefined> {
	const user = await fetch(`${process.env.SASHIDO_API_URL}users/me`, {
		method: "GET",
		headers: {
			"X-Parse-Session-Token": sessionToken || "",
			"X-Parse-Application-Id": process.env.SASHIDO_APP_ID || "",
			"X-Parse-REST-API-Key": process.env.SASHIDO_REST_KEY || ""
		},
		cache: "no-store"
	}).then((response) => response.json());

	const projects: string[] = user?.projects || [];

	if (cookieProjectId && projects.includes(cookieProjectId)) {
		return cookieProjectId;
	}

	return projects[0];
}

export type AppBootstrapData<
	TProject = Record<string, unknown>,
	TRole = Record<string, unknown>
> = {
	project?: TProject;
	roles: TRole[];
};

// Fetches the active project (with modules, for patstore) and its roles
// server-side, so `AppContextProvider` never mounts with a missing project.
// Pass explicit `TProject`/`TRole` type args at the call site (each app's
// own `PatstoreProject`/`PatflowProject`, `PatstoreRoleClass`/
// `PatflowUserRole`) since this helper itself is shared and loosely typed.
export async function fetchAppBootstrapData<
	TProject = Record<string, unknown>,
	TRole = Record<string, unknown>
>({
	appId,
	projectId,
	sessionToken
}: {
	appId: AppId;
	projectId?: string;
	sessionToken?: string;
}): Promise<AppBootstrapData<TProject, TRole>> {
	if (!projectId) {
		return { project: undefined, roles: [] };
	}

	const projectQuery = `
		query getProject($id: ID!) {
			project(id: $id) {
				${PROJECT_FIELDS[appId]}
			}
		}
	`;

	const rolesQuery = `
		query findRole($params: RoleWhereInput) {
			roles(where: $params) {
				edges { node { ${ROLE_FIELDS[appId]} } }
			}
		}
	`;

	const [projectData, rolesData] = await Promise.all([
		graphqlFetch({
			query: projectQuery,
			variables: { id: projectId },
			sessionToken
		}),
		graphqlFetch({
			query: rolesQuery,
			variables: {
				params: { project: { have: { id: { equalTo: projectId } } } }
			},
			sessionToken
		})
	]);

	const project = projectData?.project
		? cloneDeep(projectData.project)
		: undefined;

	if (project && appId === "patstore") {
		project.modules = (project.modules?.edges || []).map(
			(edge: { node: Module }) => sanitizeGraphQlNode(edge.node)
		);
	}

	const roles = (rolesData?.roles?.edges || []).map(
		(edge: { node: Record<string, unknown> }) =>
			sanitizeGraphQlNode(edge.node)
	) as TRole[];

	return { project: project as TProject | undefined, roles };
}

// Fetches a single module by its route path for the active project. Lets a
// page fetch just the module it needs, server-side, instead of reading
// `currentModule` off `PatstoreAppContext`.
export async function fetchModuleByPath({
	projectId,
	path,
	sessionToken
}: {
	projectId?: string;
	path: string;
	sessionToken?: string;
}): Promise<Module | undefined> {
	if (!projectId) {
		return undefined;
	}

	const query = `
		query findModule($params: ModuleWhereInput) {
			modules(where: $params) {
				edges { node { ${MODULE_FIELDS} } }
			}
		}
	`;

	const data = await graphqlFetch({
		query,
		variables: {
			params: {
				project: { have: { id: { equalTo: projectId } } },
				path: { equalTo: path }
			}
		},
		sessionToken
	});

	const node = data?.modules?.edges?.[0]?.node;
	return node ? (sanitizeGraphQlNode(node) as Module) : undefined;
}
