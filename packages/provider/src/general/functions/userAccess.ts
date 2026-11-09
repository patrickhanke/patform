import type { PatstoreRoleAccess } from "@repo/types";

const OBJECT_ID_PATTERN = /^[A-Za-z0-9]{10}$/;
const CLASS_NAME_PATTERN = /^[A-Za-z][A-Za-z0-9_]{0,63}$/;

export type AccessModule = {
	path?: string | null;
	connected_class?: string | null;
	position?: number | null;
	name?: string | null;
};

export const isActiveAccessGrant = (
	grant: PatstoreRoleAccess | null | undefined,
	now = Date.now()
): grant is PatstoreRoleAccess => {
	if (!grant) return false;
	if (!OBJECT_ID_PATTERN.test(grant.id || "")) return false;
	if (!CLASS_NAME_PATTERN.test(grant.className || "")) return false;
	if (grant.expires_at == null || grant.expires_at === "") return true;
	const expires = Date.parse(grant.expires_at);
	return Number.isFinite(expires) && expires > now;
};

export const recordAccessPath = (
	modulePath: string | null | undefined,
	id: string
): string | null => {
	if (!modulePath || !modulePath.startsWith("/") || modulePath.includes("..")) {
		return null;
	}
	const path = modulePath.replace(/\/+$/, "");
	if (!path || path === "/") return null;
	return `${path}/${id}`;
};

export const modulesForAccessClass = <T extends AccessModule>(
	modules: T[] | null | undefined,
	className: string
): T[] =>
	(modules || [])
		.filter(
			(module) =>
				module.connected_class === className &&
				!!recordAccessPath(module.path, "aaaaaaaaaa")
		)
		.sort(
			(a, b) =>
				(a.position ?? 0) - (b.position ?? 0) ||
				String(a.path).localeCompare(String(b.path))
		);

const RECORD_ID_PATTERN = /^[A-Za-z0-9]{10}$/;

/** Object id when the pathname is `/{modulePath}/{id}` or a route under it. */
export const recordIdFromPath = (
	modulePath: string | null | undefined,
	pathname: string | null | undefined
): string | undefined => {
	if (!modulePath || !pathname || !modulePath.startsWith("/")) return undefined;
	const path = modulePath.replace(/\/+$/, "");
	if (!path || !pathname.startsWith(`${path}/`)) return undefined;
	const id = pathname.slice(path.length + 1).split("/")[0];
	return RECORD_ID_PATTERN.test(id) ? id : undefined;
};
