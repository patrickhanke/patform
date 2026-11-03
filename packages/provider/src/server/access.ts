import "server-only";
import { cookies } from "next/headers";
import { getSessionCookieName, parseRest } from "./sashido";

export type SessionUser = {
	objectId: string;
	is_superuser?: boolean;
	projects?: string[];
	roles?: string[];
	role?: { objectId: string };
};

export type AccessContext = {
	sessionToken: string;
	user: SessionUser;
	isSuperuser: boolean;
	projectIds: string[];
	activeProjectId?: string;
};

export class AccessError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

export const OBJECT_ID_PATTERN = /^[A-Za-z0-9]{1,32}$/;

export const fetchSessionUser = async (
	sessionToken?: string
): Promise<SessionUser | null> => {
	if (!sessionToken) {
		return null;
	}

	const { status, data } = await parseRest<SessionUser>("users/me", {
		sessionToken
	});

	return status === 200 && data?.objectId ? data : null;
};

const resolveActiveProjectId = async (
	user: SessionUser,
	isSuperuser: boolean
): Promise<string | undefined> => {
	if (process.env.APP_NAME === "patflow" && process.env.PROJECT_ID) {
		return process.env.PROJECT_ID;
	}

	const cookieStore = await cookies();
	const cookieProjectId = cookieStore.get(
		`${process.env.APP_NAME || "patstore"}_project_id`
	)?.value;
	const projects = user.projects || [];

	if (
		cookieProjectId &&
		(projects.includes(cookieProjectId) ||
			(isSuperuser && OBJECT_ID_PATTERN.test(cookieProjectId)))
	) {
		return cookieProjectId;
	}

	return projects[0];
};

// Resolves the logged-in user from the HttpOnly/JS session cookie. Throws 401 if there is none.
export const getAccessContext = async (): Promise<AccessContext> => {
	const cookieStore = await cookies();
	const sessionToken = cookieStore.get(getSessionCookieName())?.value;
	const user = await fetchSessionUser(sessionToken);

	if (!sessionToken || !user) {
		throw new AccessError(401, "Nicht angemeldet");
	}

	const isSuperuser = user.is_superuser === true;

	return {
		sessionToken,
		user,
		isSuperuser,
		projectIds: user.projects || [],
		activeProjectId: await resolveActiveProjectId(user, isSuperuser)
	};
};

export const canAccessProject = (
	context: AccessContext,
	projectId?: string
): boolean =>
	!!projectId &&
	(context.isSuperuser || context.projectIds.includes(projectId));

// Picks the project a request is scoped to: an explicitly requested project (if the user may
// access it) or the active project.
export const resolveRequestProjectId = (
	context: AccessContext,
	requestedProjectId?: string
): string => {
	const projectId = requestedProjectId || context.activeProjectId;

	if (!projectId || !canAccessProject(context, projectId)) {
		throw new AccessError(403, "Kein Zugriff auf dieses Projekt");
	}

	return projectId;
};

export const toErrorResponseInit = (error: unknown) => {
	if (error instanceof AccessError) {
		return { status: error.status, message: error.message };
	}
	return { status: 500, message: "Interner Fehler" };
};
