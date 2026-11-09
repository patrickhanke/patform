import "server-only";
import type { PatstoreRoleAccess } from "@repo/types";
import { pluralize } from "../general/Apollo/functions/helpers";
import {
	type AccessField,
	type AccessModuleShape,
	type AccessRole,
	canCreateRecord,
	canDeleteRecord,
	canEnterModule,
	canEnterRecord,
	canReadField,
	canUpdateRecord,
	canWriteField,
	grantsForClass,
	pageGrantRecords
} from "../general/functions/fieldAccess";
import { AccessError } from "./access";
import { parseRest } from "./sashido";

export type StoredAccessModule = AccessModuleShape & {
	objectId: string;
	path?: string | null;
	name?: string | null;
	position?: number | null;
};

type ParseObject = Record<string, any>;

const KEEP_KEYS = new Set([
	"objectId",
	"createdAt",
	"updatedAt",
	"ACL",
	"project",
	"className",
	"__type",
	"created_by",
	"updated_by"
]);

export const loadProjectModules = async (
	projectId: string
): Promise<StoredAccessModule[]> => {
	const where = JSON.stringify({
		project: { __type: "Pointer", className: "Project", objectId: projectId }
	});
	const { status, data } = await parseRest<{
		results?: StoredAccessModule[];
		error?: string;
	}>(`classes/Module?where=${encodeURIComponent(where)}&limit=200`, {
		useMasterKey: true
	});
	if (status === 400 || status === 404) return [];
	if (status >= 400) {
		throw new AccessError(status, data.error || "Module konnten nicht geladen werden");
	}
	return data.results || [];
};

export const loadAccessRoles = async (
	projectId: string,
	userId: string
): Promise<AccessRole[]> => {
	const where = JSON.stringify({
		project: { __type: "Pointer", className: "Project", objectId: projectId },
		users: { __type: "Pointer", className: "_User", objectId: userId }
	});
	const { status, data } = await parseRest<{
		results?: AccessRole[];
		error?: string;
	}>(`classes/_Role?where=${encodeURIComponent(where)}&limit=50`, {
		useMasterKey: true
	});
	if (status >= 400) {
		throw new AccessError(status, data.error || "Rollen konnten nicht geladen werden");
	}
	return (data.results || []).map((role) => ({
		objectId: role.objectId,
		modules: role.modules || [],
		access: (role.access || []) as PatstoreRoleAccess[]
	}));
};

const modulesForClass = (modules: StoredAccessModule[], className: string) =>
	modules.filter((module) => module.connected_class === className);

const enteredModules = (
	roles: AccessRole[],
	modules: StoredAccessModule[],
	recordId?: string
) =>
	modules.filter(
		(module) =>
			canEnterModule(roles, module) ||
			(!!recordId && canEnterRecord(roles, module.connected_class, recordId))
	);

const fieldKeys = (field: AccessField) =>
	[field.id, field.name].filter((key): key is string => !!key);

const keysDeniedBy = (
	roles: AccessRole[],
	modules: StoredAccessModule[],
	bucket: "fields" | "data_fields" | "setting_fields",
	recordId: string | undefined,
	action: "read" | "write",
	isCreate: boolean
) => {
	const denied = new Set<string>();
	const allowed = new Set<string>();
	modules.forEach((module) => {
		(module[bucket] || []).forEach((field) => {
			const permitted =
				action === "read"
					? canReadField(roles, module, field, recordId)
					: canWriteField(roles, module, field, recordId, isCreate);
			fieldKeys(field).forEach((key) =>
				(permitted ? allowed : denied).add(key)
			);
		});
	});
	allowed.forEach((key) => denied.delete(key));
	return denied;
};

export const constrainReadWhere = (
	where: ParseObject | undefined,
	roles: AccessRole[],
	modules: StoredAccessModule[],
	className: string
): ParseObject | undefined => {
	const related = modulesForClass(modules, className);
	if (related.length === 0) return where;
	if (related.some((module) => canEnterModule(roles, module))) return where;
	const ids = [
		...new Set(grantsForClass(roles, className).map((grant) => grant.id))
	];
	const limit = { objectId: { $in: ids.length > 0 ? ids : ["0000000000"] } };
	return where ? { $and: [where, limit] } : limit;
};

export const stripRecordFields = (
	record: ParseObject,
	roles: AccessRole[],
	modules: StoredAccessModule[],
	className: string
) => {
	const related = modulesForClass(modules, className);
	if (related.length === 0) return record;
	const applicable = enteredModules(roles, related, record.objectId);
	if (applicable.length === 0) return record;
	const copy = { ...record };
	keysDeniedBy(roles, applicable, "fields", record.objectId, "read", false).forEach(
		(key) => {
			if (!KEEP_KEYS.has(key)) delete copy[key];
		}
	);
	if (copy.data && typeof copy.data === "object" && !Array.isArray(copy.data)) {
		const data = { ...copy.data };
		keysDeniedBy(
			roles,
			applicable,
			"data_fields",
			record.objectId,
			"read",
			false
		).forEach((key) => delete data[key]);
		copy.data = data;
	}
	if (
		copy.settings &&
		typeof copy.settings === "object" &&
		!Array.isArray(copy.settings)
	) {
		const settings = { ...copy.settings };
		keysDeniedBy(
			roles,
			applicable,
			"setting_fields",
			record.objectId,
			"read",
			false
		).forEach((key) => delete settings[key]);
		copy.settings = settings;
	}
	return copy;
};

export const stripReadResult = (
	payload: ParseObject,
	roles: AccessRole[],
	modules: StoredAccessModule[],
	className: string
) => {
	if (Array.isArray(payload?.results)) {
		return {
			...payload,
			results: payload.results.map((record: ParseObject) =>
				stripRecordFields(record, roles, modules, className)
			)
		};
	}
	if (payload?.objectId) {
		return stripRecordFields(payload, roles, modules, className);
	}
	return payload;
};

const assertObjectAction = (
	roles: AccessRole[],
	related: StoredAccessModule[],
	objectId: string | undefined,
	isCreate: boolean
) => {
	const allowed = related.some((module) =>
		isCreate
			? canCreateRecord(roles, module)
			: canUpdateRecord(roles, module, objectId)
	);
	if (!allowed) {
		throw new AccessError(403, "Keine Berechtigung");
	}
};

export const stripWriteObject = (
	data: ParseObject,
	roles: AccessRole[],
	modules: StoredAccessModule[],
	className: string,
	objectId: string | undefined,
	isCreate: boolean
) => {
	const related = modulesForClass(modules, className);
	if (related.length === 0) return data;
	assertObjectAction(roles, related, objectId, isCreate);
	const applicable = related.filter((module) =>
		isCreate
			? canCreateRecord(roles, module)
			: canUpdateRecord(roles, module, objectId)
	);
	const copy = { ...data };
	keysDeniedBy(roles, applicable, "fields", objectId, "write", isCreate).forEach(
		(key) => {
			if (!KEEP_KEYS.has(key)) delete copy[key];
		}
	);
	if (copy.data && typeof copy.data === "object" && !Array.isArray(copy.data)) {
		const nested = { ...copy.data };
		keysDeniedBy(
			roles,
			applicable,
			"data_fields",
			objectId,
			"write",
			isCreate
		).forEach((key) => delete nested[key]);
		copy.data = nested;
	}
	if (
		copy.settings &&
		typeof copy.settings === "object" &&
		!Array.isArray(copy.settings)
	) {
		const nested = { ...copy.settings };
		keysDeniedBy(
			roles,
			applicable,
			"setting_fields",
			objectId,
			"write",
			isCreate
		).forEach((key) => delete nested[key]);
		copy.settings = nested;
	}
	return copy;
};

export const assertMayDeleteRecord = (
	roles: AccessRole[],
	modules: StoredAccessModule[],
	className: string,
	objectId: string
) => {
	const related = modulesForClass(modules, className);
	if (related.length === 0) return;
	if (!related.some((module) => canDeleteRecord(roles, module, objectId))) {
		throw new AccessError(403, "Keine Berechtigung");
	}
};

export const loadContentAccess = async (projectId: string, userId: string) => {
	const modules = await loadProjectModules(projectId);
	if (modules.length === 0) {
		return { modules, roles: [] as AccessRole[] };
	}
	const roles = await loadAccessRoles(projectId, userId);
	const pageAccess = pageGrantRecords(modules, userId).map((grant) => ({
		id: grant.id,
		className: grant.className as PatstoreRoleAccess["className"],
		expires_at: null
	}));
	if (pageAccess.length > 0) {
		roles.push({ objectId: `pages:${userId}`, modules: [], access: pageAccess });
	}
	return { modules, roles };
};

export const classNameForGraphqlField = (
	field: string,
	modules: StoredAccessModule[]
) => {
	const key = field.toLowerCase();
	return modules.find((module) => {
		const className = module.connected_class;
		if (!className) return false;
		return (
			className.toLowerCase() === key ||
			pluralize(className).toLowerCase() === key
		);
	})?.connected_class;
};

export const stripGraphqlData = (
	payload: ParseObject,
	roles: AccessRole[],
	modules: StoredAccessModule[]
) => {
	if (!payload || typeof payload !== "object") return payload;
	const copy: ParseObject = { ...payload };
	Object.entries(copy).forEach(([field, value]) => {
		const className = classNameForGraphqlField(field, modules);
		if (!className || !value || typeof value !== "object") return;
		const related = modulesForClass(modules, className);
		if (Array.isArray((value as ParseObject).edges)) {
			const edges = ((value as ParseObject).edges as ParseObject[]).flatMap(
				(edge) => {
					const record = edge?.node as ParseObject | undefined;
					if (!record) return [edge];
					const visible = enteredModules(roles, related, record.objectId);
					if (visible.length === 0) return [];
					return [
						{
							...edge,
							node: stripRecordFields(record, roles, related, className)
						}
					];
				}
			);
			copy[field] = { ...(value as ParseObject), edges };
			return;
		}
		if ((value as ParseObject).objectId) {
			const record = value as ParseObject;
			if (enteredModules(roles, related, record.objectId).length === 0) {
				copy[field] = null;
				return;
			}
			copy[field] = stripRecordFields(record, roles, related, className);
		}
	});
	return copy;
};

export const prepareContentRead = async (
	projectId: string,
	userId: string,
	className: string,
	where: ParseObject | undefined
) => {
	const access = await loadContentAccess(projectId, userId);
	if (access.modules.length === 0) return { access, where };
	return {
		access,
		where: constrainReadWhere(where, access.roles, access.modules, className)
	};
};

export const enforceContentWrite = async ({
	projectId,
	userId,
	className,
	data,
	objectId,
	isCreate
}: {
	projectId: string;
	userId: string;
	className: string;
	data: ParseObject;
	objectId?: string;
	isCreate: boolean;
}) => {
	const { modules, roles } = await loadContentAccess(projectId, userId);
	return stripWriteObject(data, roles, modules, className, objectId, isCreate);
};

export const enforceContentDelete = async (
	projectId: string,
	userId: string,
	className: string,
	objectId: string
) => {
	const { modules, roles } = await loadContentAccess(projectId, userId);
	assertMayDeleteRecord(roles, modules, className, objectId);
};
