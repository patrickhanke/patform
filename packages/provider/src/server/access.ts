import "server-only";
import { cookies } from "next/headers";
import { getSessionCookieName, parseRest } from "./sashido";

export type SessionUser = {
	objectId: string;
	is_superuser?: boolean;
	projects?: string[];
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

type SessionResponse = SessionUser & {
	code?: number;
	error?: string;
};

// Parse uses 209 / "invalid session token" when the token is missing or expired.
// Other failures (timeouts, 429, 5xx) must not be treated as a logout.
const isRejectedSession = (status: number, data?: SessionResponse) => {
	if (status === 401) return true;
	if (data?.code === 209) return true;
	return (
		typeof data?.error === "string" &&
		/invalid session token/i.test(data.error)
	);
};

const FRESH_SESSION_MS = 60_000;
const STALE_SESSION_MS = 3 * 60_000;

const sessionCache = new Map<string, { user: SessionUser; checkedAt: number }>();

const cachedSession = (sessionToken: string) => {
	const entry = sessionCache.get(sessionToken);
	if (!entry) return undefined;
	if (Date.now() - entry.checkedAt > STALE_SESSION_MS) {
		sessionCache.delete(sessionToken);
		return undefined;
	}
	return entry;
};

const rememberSession = (sessionToken: string, user: SessionUser) => {
	sessionCache.set(sessionToken, { user, checkedAt: Date.now() });
	return user;
};

const readSessionUser = async (
	sessionToken: string
): Promise<
	| { state: "user"; user: SessionUser }
	| { state: "invalid" }
	| { state: "unavailable"; detail: string }
> => {
	const { status, data } = await parseRest<SessionResponse>("users/me", {
		sessionToken
	});

	if (status === 200 && data?.objectId) {
		return { state: "user", user: data };
	}
	if (isRejectedSession(status, data)) {
		return { state: "invalid" };
	}

	const where = encodeURIComponent(JSON.stringify({ sessionToken }));
	const fallback = await parseRest<{
		results?: { user?: SessionUser }[];
		code?: number;
		error?: string;
	}>(`classes/_Session?where=${where}&include=user&limit=1`, {
		useMasterKey: true
	});
	const fallbackUser = fallback.data?.results?.[0]?.user;
	if (fallback.status === 200 && fallbackUser?.objectId) {
		return { state: "user", user: fallbackUser };
	}

	const detail = [status, data?.error].filter(Boolean).join(" ");
	return { state: "unavailable", detail };
};

export const fetchSessionUser = async (
	sessionToken?: string
): Promise<SessionUser | null> => {
	if (!sessionToken) {
		return null;
	}

	const cached = cachedSession(sessionToken);
	if (cached && Date.now() - cached.checkedAt < FRESH_SESSION_MS) {
		return cached.user;
	}

	let failure = "Anmeldung konnte nicht geprüft werden";
	for (let attempt = 0; attempt < 3; attempt += 1) {
		try {
			const result = await readSessionUser(sessionToken);
			if (result.state === "user") {
				return rememberSession(sessionToken, result.user);
			}
			if (result.state === "invalid") {
				sessionCache.delete(sessionToken);
				return null;
			}
			failure = `Anmeldung konnte nicht geprüft werden (${result.detail})`;
		} catch (error) {
			failure =
				error instanceof Error
					? `Anmeldung konnte nicht geprüft werden (${error.message})`
					: failure;
		}
		if (attempt < 2) {
			await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
		}
	}

	if (cached) return cached.user;
	throw new AccessError(503, failure);
};

// One credential check, then every task runs with that user. Tasks must not call getAccessContext again.
// pauseMs spaces the tasks so the database can finish one write before the next starts.
export const withLegitimateUser = async <T>(
	tasks: Array<(context: AccessContext) => Promise<T>>,
	pauseMs = 0
): Promise<T[]> => {
	const context = await getAccessContext();
	if (pauseMs <= 0) {
		return Promise.all(tasks.map((task) => task(context)));
	}

	const results: T[] = [];
	for (let index = 0; index < tasks.length; index += 1) {
		results.push(await tasks[index](context));
		if (index < tasks.length - 1) {
			await new Promise((resolve) => setTimeout(resolve, pauseMs));
		}
	}
	return results;
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
