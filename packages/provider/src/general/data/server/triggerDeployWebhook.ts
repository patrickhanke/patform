import "server-only";
import {
	AccessError,
	canAccessProject,
	getAccessContext,
	OBJECT_ID_PATTERN
} from "../../../server/access";
import { parseRest } from "../../../server/sashido";

const PROJECT_UUIDS = {
	koloproktologie: "8utwscyidznxnv3os29juxwm",
	coloproktologen: "qkev9d3hcoeb8uc5tkt1jplz"
} as const;

const COOLIFY_API = "https://coolify.patwork.net";

const TVSTG_CLASSES = new Set([
	"Article",
	"Webpage",
	"Content",
	"Entry",
	"Event",
	"Form",
	"Image",
	"Group",
	"Download",
	"Person",
	"Category",
	"Appointment"
]);

const PATWORK_CLASSES = new Set(["Article", "Webpage", "Content"]);

type ProjectRef = {
	objectId: string;
	path?: string;
};

const coolifyToken = () => process.env.COOLIFY_WEBHOOK_TOKEN || "";

const postWebhook = async (url: string, withToken = false, uuid?: string) => {
	const headers: Record<string, string> = {
		Accept: "application/json"
	};

	if (withToken) {
		const token = coolifyToken();
		if (!token) {
			console.error(
				"COOLIFY_WEBHOOK_TOKEN is not configured on the server"
			);
			return;
		}
		headers.Authorization = `Bearer ${token}`;
		headers["Content-Type"] = "application/json";
	}

	const envResponse = await fetch(
		`${COOLIFY_API}/api/v1/applications/${uuid}/envs`,
		{
			method: "PATCH",
			headers,
			body: JSON.stringify({
				key: "PATSTORE_SNAPSHOT_BUST",
				value: String(Date.now())
			})
		}
	);

	if (!envResponse.ok) {
		console.error("Coolify env update failed", envResponse.status);
		return;
	}

	const response = await fetch(url, {
		method: "POST",
		headers,
		body: withToken ? "{}" : undefined,
		cache: "no-store"
	});

	if (!response.ok) {
		console.error("Deploy webhook failed", response.status);
	}
};

const loadProject = async (
	projectId: string
): Promise<ProjectRef | undefined> => {
	const { status, data } = await parseRest<ProjectRef>(
		`classes/Project/${projectId}`,
		{ useMasterKey: true }
	);

	if (status >= 400 || !data?.objectId) {
		console.error("Deploy webhook: project could not be loaded", status);
		return undefined;
	}

	return { objectId: data.objectId, path: data.path };
};

// Which deploy hook runs depends on the project loaded for this request.
// A project switch therefore selects a different webhook. URLs stay on the server.
const dispatchWebhook = async (project: ProjectRef, objectClass: string) => {
	if (project.path === "bcd") {
		await postWebhook(
			`${COOLIFY_API}/api/v1/deploy?uuid=${PROJECT_UUIDS.coloproktologen}&force=false`,
			true,
			PROJECT_UUIDS.coloproktologen
		);
		return;
	}
	if (project.path === "tvstg") {
		if (TVSTG_CLASSES.has(objectClass)) {
			await postWebhook(
				"https://api.netlify.com/build_hooks/608c71bcb42fb00f6e535a9c"
			);
			return;
		}
	}
	if (project.path === "patwork") {
		if (PATWORK_CLASSES.has(objectClass)) {
			await Promise.all([
				postWebhook(
					"https://api.netlify.com/build_hooks/684a8ce3f81b3b21f4aa34d8"
				),
				postWebhook(
					"https://api.vercel.com/v1/integrations/deploy/prj_OhGFYMtNJUrzaAoTTHMsBUVybA5G/zgrsBETrlk"
				)
			]);
			return;
		}
	}
	if (project.objectId === "JRxDkaxCoI") {
		if (objectClass !== "User") {
			await postWebhook(
				`${COOLIFY_API}/api/v1/deploy?uuid=${PROJECT_UUIDS.koloproktologie}&force=false`,
				true,
				PROJECT_UUIDS.koloproktologie
			);
			return;
		}
	}
	if (project.objectId === "JwPcBkuLDi") {
		if (objectClass !== "User") {
			await postWebhook(
				"https://api.netlify.com/build_hooks/6a425999f5c9e23580ef3d53"
			);
			return;
		}
	}
	if (project.path === "bei_lisa") {
		await postWebhook(
			"https://api.netlify.com/build_hooks/698058ffd5736a2e12b62c64"
		);
	}
	if (project.path === "nocogirls") {
		await postWebhook(
			"https://api.vercel.com/v1/integrations/deploy/prj_GnCaZnL9fR9nmXrHVogTmb3cTHIg/ZOrT890F4A"
		);
	}
};

export async function triggerDeployWebhook(
	objectClass: string,
	projectId?: string
) {
	const context = await getAccessContext();
	const id = projectId || context.activeProjectId;

	if (!id) {
		return;
	}
	if (!OBJECT_ID_PATTERN.test(id) || !canAccessProject(context, id)) {
		throw new AccessError(403, "Kein Zugriff auf dieses Projekt");
	}

	const project = await loadProject(id);
	if (!project) {
		return;
	}

	await dispatchWebhook(project, objectClass);
}
