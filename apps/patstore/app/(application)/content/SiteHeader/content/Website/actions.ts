"use server";

import {
	AccessError,
	canAccessProject,
	getAccessContext,
	OBJECT_ID_PATTERN,
	parseRest
} from "@repo/provider/server";
import {
	WebsiteActionResult,
	WebsiteBuildState,
	WebsiteBuildStatus,
	WebsiteDeployment
} from "./types";

const COOLIFY_API = "https://coolify.patwork.net";

const ADMIN_EMAIL = "info@patwork.net";

type ProjectRecord = {
	objectId: string;
	path?: string;
	name?: string;
	settings?: {
		uuid?: string;
	};
};

type CoolifyDeployment = {
	id?: number;
	deployment_uuid?: string;
	status?: string;
	commit?: string;
	commit_message?: string;
	created_at?: string;
	logs?: string;
};

type ResolvedProject = {
	project: ProjectRecord;
	uuid: string;
	sessionToken: string;
};

const coolifyToken = () => process.env.COOLIFY_WEBHOOK_TOKEN || "";

const coolifyHeaders = (token: string) => ({
	Accept: "application/json",
	Authorization: `Bearer ${token}`,
	"Content-Type": "application/json"
});

const toStatus = (value: string | undefined): WebsiteBuildStatus => {
	const status = (value || "").toLowerCase();
	if (
		status === "finished" ||
		status === "success" ||
		status === "successful"
	) {
		return "success";
	}
	if (
		status === "queued" ||
		status === "in_progress" ||
		status === "in-progress" ||
		status === "pending" ||
		status === "building"
	) {
		return "building";
	}
	if (
		status.includes("fail") ||
		status.includes("cancel") ||
		status === "error"
	) {
		return "failed";
	}
	return "building";
};

const deploymentTime = (deployment: CoolifyDeployment) => {
	const parsed = Date.parse(deployment.created_at || "");
	return Number.isNaN(parsed) ? 0 : parsed;
};

const readDeployments = (payload: unknown): CoolifyDeployment[] => {
	if (Array.isArray(payload)) {
		return payload as CoolifyDeployment[];
	}
	if (
		payload &&
		typeof payload === "object" &&
		"deployments" in payload &&
		Array.isArray(payload.deployments)
	) {
		return payload.deployments as CoolifyDeployment[];
	}
	return [];
};

const toDeployment = (
	deployment: CoolifyDeployment
): WebsiteDeployment | undefined => {
	const id =
		deployment.deployment_uuid ||
		(deployment.id !== undefined ? String(deployment.id) : "");
	if (!id) {
		return undefined;
	}
	return {
		id,
		status: toStatus(deployment.status),
		createdAt: deployment.created_at || "",
		commit: deployment.commit || "",
		message: deployment.commit_message || ""
	};
};

const loadProject = async (
	projectId: string
): Promise<ProjectRecord | undefined> => {
	const { status, data } = await parseRest<ProjectRecord>(
		`classes/Project/${projectId}`,
		{ useMasterKey: true }
	);
	if (status >= 400 || !data?.objectId) {
		return undefined;
	}
	return data;
};

const resolveProject = async (): Promise<ResolvedProject | undefined> => {
	const context = await getAccessContext();
	const projectId = context.activeProjectId;
	if (
		!projectId ||
		!OBJECT_ID_PATTERN.test(projectId) ||
		!canAccessProject(context, projectId)
	) {
		return undefined;
	}

	const project = await loadProject(projectId);
	if (!project || !project.settings?.uuid) {
		return undefined;
	}


	return {
		project,
		uuid: project.settings?.uuid || "",
		sessionToken: context.sessionToken
	};
};

const fetchCoolifyDeployments = async (
	uuid: string
): Promise<CoolifyDeployment[]> => {
	const token = coolifyToken();
	if (!token) {
		throw new Error(
			"COOLIFY_WEBHOOK_TOKEN is not configured on the server"
		);
	}

	const response = await fetch(
		`${COOLIFY_API}/api/v1/deployments/applications/${uuid}?take=20`,
		{
			headers: coolifyHeaders(token),
			cache: "no-store"
		}
	);

	if (!response.ok) {
		throw new Error(`Coolify deployments failed (${response.status})`);
	}

	const payload = (await response.json().catch(() => ({}))) as unknown;
	return readDeployments(payload)
		.sort(
			(left, right) =>
				deploymentTime(right) - deploymentTime(left) ||
				(right.id || 0) - (left.id || 0)
		)
		.slice(0, 5);
};

const actionError = (error: unknown, fallback: string): WebsiteActionResult => {
	if (error instanceof AccessError) {
		return { ok: false, error: error.message };
	}
	console.error(fallback, error instanceof Error ? error.message : error);
	return { ok: false, error: fallback };
};

export async function fetchWebsiteBuildState(): Promise<WebsiteBuildState> {
	try {
		const resolved = await resolveProject();
		if (!resolved || !resolved.uuid) {
			return { applicable: false, deployments: [] };
		}

		const deployments = (await fetchCoolifyDeployments(resolved.uuid))
			.map(toDeployment)
			.filter(
				(deployment): deployment is WebsiteDeployment => !!deployment
			);

		return { applicable: true, deployments };
	} catch (error) {
		if (error instanceof AccessError) {
			return { applicable: false, deployments: [], error: error.message };
		}
		console.error(
			"Website build state failed",
			error instanceof Error ? error.message : error
		);
		return {
			applicable: true,
			deployments: [],
			error: "Der Build-Status konnte nicht geladen werden."
		};
	}
}

export async function retryWebsiteBuild(): Promise<WebsiteActionResult> {
	try {
		const resolved = await resolveProject();
		if (!resolved) {
			return { ok: false, error: "Kein Zugriff auf dieses Projekt" };
		}

		const token = coolifyToken();
		if (!token) {
			console.error(
				"COOLIFY_WEBHOOK_TOKEN is not configured on the server"
			);
			return {
				ok: false,
				error: "Der Build konnte nicht gestartet werden."
			};
		}

		const headers = coolifyHeaders(token);
		const envResponse = await fetch(
			`${COOLIFY_API}/api/v1/applications/${resolved.uuid}/envs`,
			{
				method: "PATCH",
				headers,
				body: JSON.stringify({
					key: "PATSTORE_SNAPSHOT_BUST",
					value: String(Date.now())
				}),
				cache: "no-store"
			}
		);

		if (!envResponse.ok) {
			console.error("Coolify env update failed", envResponse.status);
			return {
				ok: false,
				error: "Der Build konnte nicht gestartet werden."
			};
		}

		const response = await fetch(
			`${COOLIFY_API}/api/v1/deploy?uuid=${resolved.uuid}&force=false`,
			{
				method: "POST",
				headers,
				body: "{}",
				cache: "no-store"
			}
		);

		if (!response.ok) {
			console.error("Deploy webhook failed", response.status);
			return {
				ok: false,
				error: "Der Build konnte nicht gestartet werden."
			};
		}

		return { ok: true };
	} catch (error) {
		return actionError(error, "Der Build konnte nicht gestartet werden.");
	}
}

const escapeHtml = (value: string) =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");

const failureEmail = (
	project: ProjectRecord,
	deployment: CoolifyDeployment
) => {
	const logs = (deployment.logs || "").trim().slice(-1500);
	const rows: [string, string][] = [
		["Projekt", project.name || "Unbekannt"],
		["Status", deployment.status || "failed"],
		[
			"Deployment",
			deployment.deployment_uuid || String(deployment.id || "")
		],
		["Commit", deployment.commit || ""],
		["Nachricht", deployment.commit_message || ""],
		["Zeitpunkt", deployment.created_at || ""]
	];

	const details = rows
		.filter(([, value]) => value)
		.map(
			([label, value]) =>
				`<li><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</li>`
		)
		.join("");

	const logBlock = logs ? `<pre>${escapeHtml(logs)}</pre>` : "";

	return `
		<h2>Build der Website fehlgeschlagen</h2>
		<p>Der Website-Build ist nach einem erneuten Versuch fehlgeschlagen.</p>
		<ul>${details}</ul>
		${logBlock}
	`.trim();
};

const cloudError = (data: {
	error?: unknown;
	result?: { success?: boolean; message?: string };
}) => {
	if (typeof data.error === "string" && data.error) {
		return data.error;
	}
	if (
		data.error &&
		typeof data.error === "object" &&
		"message" in data.error &&
		typeof data.error.message === "string"
	) {
		return data.error.message;
	}
	if (data.result?.success === false) {
		return (
			data.result.message || "Die E-Mail konnte nicht gesendet werden."
		);
	}
	return undefined;
};

export async function notifyWebsiteAdministrator(): Promise<WebsiteActionResult> {
	try {
		const resolved = await resolveProject();
		if (!resolved) {
			return { ok: false, error: "Kein Zugriff auf dieses Projekt" };
		}

		const deployments = await fetchCoolifyDeployments(resolved.uuid);
		const latest = deployments[0];
		if (!latest || toStatus(latest.status) !== "failed") {
			return {
				ok: false,
				error: "Es liegt kein fehlgeschlagener Build vor."
			};
		}

		const content = failureEmail(resolved.project, latest);
		const { status, data } = await parseRest<{
			error?: unknown;
			result?: { success?: boolean; message?: string };
		}>("functions/send_email_to_users", {
			method: "POST",
			sessionToken: resolved.sessionToken,
			body: {
				project_id: resolved.project.objectId,
				subject: "Build der Website fehlgeschlagen",
				content,
				recipients: [
					{
						name: "patwork",
						email: ADMIN_EMAIL,
						data: {
							first_name: "",
							last_name: "",
							title: "",
							pre_title: "",
							post_title: "",
							list_name: "Website-Build",
							project_name: resolved.project.name || "Unbekannt",
							project_path: resolved.project.path || "",
							deployment_id:
								latest.deployment_uuid ||
								String(latest.id || ""),
							status: latest.status || "failed",
							commit: latest.commit || "",
							commit_message: latest.commit_message || "",
							created_at: latest.created_at || "",
							logs: (latest.logs || "").trim().slice(-1500)
						}
					}
				]
			}
		});

		const message = cloudError(data);
		if (status >= 400 || message) {
			console.error("send_email_to_users failed", status, message);
			return {
				ok: false,
				error: "Die Benachrichtigung konnte nicht gesendet werden."
			};
		}

		return { ok: true };
	} catch (error) {
		return actionError(
			error,
			"Die Benachrichtigung konnte nicht gesendet werden."
		);
	}
}
