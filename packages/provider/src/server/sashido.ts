import "server-only";

export type SashidoConfig = {
	apiUrl: string;
	gqlUrl: string;
	appId: string;
	restKey: string;
};

export const getSashidoConfig = (): SashidoConfig => ({
	apiUrl: process.env.SASHIDO_API_URL || "",
	gqlUrl: process.env.SASHIDO_GQL_URL || "",
	appId: process.env.SASHIDO_APP_ID || "",
	restKey: process.env.SASHIDO_REST_KEY || ""
});

// The master key is intentionally not part of next.config `env` (that would inline it into
// client bundles). It is read at runtime from the prefixed root `.env` value or the plain name.
export const getMasterKey = (): string => {
	const appName = process.env.APP_NAME;
	const prefixed =
		appName === "patflow"
			? process.env.PATFLOW_SASHIDO_MASTER_KEY
			: appName === "patstore"
				? process.env.PATSTORE_SASHIDO_MASTER_KEY
				: undefined;
	const masterKey = prefixed || process.env.SASHIDO_MASTER_KEY;

	if (!masterKey) {
		throw new Error("SASHIDO_MASTER_KEY is not configured on the server");
	}

	return masterKey;
};

export const getSessionCookieName = (): string =>
	process.env.SESSION_TOKEN ||
	(process.env.APP_NAME === "patflow" ? "patflow_session_token" : "patstore_token");

export const createParseHeaders = ({
	sessionToken,
	useMasterKey = false
}: {
	sessionToken?: string;
	useMasterKey?: boolean;
}): Record<string, string> => {
	const { appId, restKey } = getSashidoConfig();
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		"X-Parse-Application-Id": appId,
		"X-Parse-REST-API-Key": restKey
	};

	if (sessionToken) {
		headers["X-Parse-Session-Token"] = sessionToken;
	}

	if (useMasterKey) {
		headers["X-Parse-Master-Key"] = getMasterKey();
	}

	return headers;
};

export const parseRest = async <T = any>(
	path: string,
	{
		method = "GET",
		body,
		sessionToken,
		useMasterKey = false
	}: {
		method?: "GET" | "POST" | "PUT" | "DELETE";
		body?: unknown;
		sessionToken?: string;
		useMasterKey?: boolean;
	} = {}
): Promise<{ status: number; data: T }> => {
	const headers = createParseHeaders({ sessionToken, useMasterKey });
	if (body === undefined) {
		delete headers["Content-Type"];
	}

	const response = await fetch(`${getSashidoConfig().apiUrl}${path}`, {
		method,
		headers,
		body: body === undefined ? undefined : JSON.stringify(body),
		cache: "no-store"
	});

	const data = (await response.json().catch(() => ({}))) as T;

	return { status: response.status, data };
};
