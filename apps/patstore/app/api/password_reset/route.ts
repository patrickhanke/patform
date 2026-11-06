import { NextRequest, NextResponse } from "next/server";
import { OBJECT_ID_PATTERN, parseRest } from "@repo/provider/server";

type CloudBody<T> = {
	result?: T;
	error?: string | { message?: string };
};

type ProjectsResult = {
	success?: boolean;
	message?: string;
	projects?: unknown[];
};

type ResetResult = {
	success?: boolean;
	message?: string;
	type?: string;
};

const cloudError = (data: CloudBody<unknown> | undefined) => {
	const error = data?.error;
	if (typeof error === "string" && error) return error;
	if (error && typeof error === "object" && error.message) return error.message;
	return undefined;
};

const projectIdOf = (entry: unknown) => {
	if (typeof entry === "string" && entry) return entry;
	if (
		entry &&
		typeof entry === "object" &&
		"id" in entry &&
		typeof entry.id === "string" &&
		entry.id
	) {
		return entry.id;
	}
	return undefined;
};

const failure = (error: string, status: number) =>
	NextResponse.json({ error }, { status });

export async function POST(request: NextRequest) {
	let email = "";
	let requestedProjectId = "";
	try {
		const body = await request.json();
		email = typeof body?.email === "string" ? body.email.trim() : "";
		if (
			typeof body?.projectId === "string" &&
			OBJECT_ID_PATTERN.test(body.projectId)
		) {
			requestedProjectId = body.projectId;
		}
	} catch {
		return failure("Ungültige Anfrage.", 400);
	}

	if (!email) {
		return failure("Keine E-Mail Adresse angegeben.", 400);
	}

	try {
		const projectsResponse = await parseRest<CloudBody<ProjectsResult>>(
			"functions/get_user_projects_with_lettermint_key",
			{ method: "POST", body: { email }, useMasterKey: true }
		);
		const projectsBody = projectsResponse.data;
		const projectsMessage = cloudError(projectsBody);
		if (projectsResponse.status >= 400 || projectsMessage) {
			return failure(
				projectsMessage || "Die Projekte für diese E-Mail konnten nicht geladen werden.",
				projectsResponse.status >= 400 && projectsResponse.status < 500
					? projectsResponse.status
					: 502
			);
		}

		const projectsResult = projectsBody.result;
		if (!projectsResult?.success) {
			return failure(
				projectsResult?.message || "Kein Nutzer für diese E-Mail Adresse gefunden.",
				404
			);
		}

		const projectIds = (projectsResult.projects || [])
			.map(projectIdOf)
			.filter((id): id is string => !!id);
		const projectId = projectIds.includes(requestedProjectId)
			? requestedProjectId
			: undefined;

		const resetResponse = await parseRest<CloudBody<ResetResult>>(
			"functions/send_password_reset",
			{
				method: "POST",
				body: projectId ? { email, project_id: projectId } : { email },
				useMasterKey: true
			}
		);
		const resetBody = resetResponse.data;
		const resetMessage = cloudError(resetBody);
		if (
			resetResponse.status >= 400 ||
			resetMessage ||
			resetBody.result?.success === false
		) {
			return failure(
				resetMessage ||
					resetBody.result?.message ||
					"Der Passwort-Reset konnte nicht gesendet werden.",
				resetResponse.status >= 400 && resetResponse.status < 500
					? resetResponse.status
					: 502
			);
		}

		if (!resetBody.result) {
			return failure("Der Passwort-Reset konnte nicht gesendet werden.", 502);
		}

		return NextResponse.json(resetBody.result);
	} catch (error) {
		console.error(
			"password_reset error:",
			error instanceof Error ? error.message : error
		);
		return failure("Der Passwort-Reset konnte nicht gesendet werden.", 500);
	}
}
