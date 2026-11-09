import type {
	FieldPermission,
	ModulePermission,
	ModuleRoleAction,
	PatstoreRoleAccess
} from "@repo/types";
import { isActiveAccessGrant, recordAccessPath } from "./userAccess";

export type AccessRole = {
	objectId: string;
	modules?: string[] | null;
	access?: PatstoreRoleAccess[] | null;
};

export type AccessField = {
	id?: string;
	name?: string;
	permission?: FieldPermission | null;
};

export type AccessModuleShape = {
	objectId?: string;
	path?: string | null;
	connected_class?: string | null;
	permission?: ModulePermission | null;
	settings?: { permission?: ModulePermission | null } | null;
	fields?: AccessField[] | null;
	data_fields?: AccessField[] | null;
	setting_fields?: AccessField[] | null;
};

export const readModulePermission = (
	module: AccessModuleShape | null | undefined
): ModulePermission | undefined => {
	if (!module) return undefined;
	if (module.permission != null) return module.permission;
	if (module.settings && Object.prototype.hasOwnProperty.call(module.settings, "permission")) {
		return module.settings.permission ?? {};
	}
	return undefined;
};

const ROLE_ACTIONS: ModuleRoleAction[] = [
	"access",
	"read",
	"write",
	"create",
	"update",
	"delete"
];

export const moduleUsesLegacy = (module: AccessModuleShape) => {
	const permission = readModulePermission(module);
	if (permission == null) return true;
	return ROLE_ACTIONS.every((action) => permission[action] === undefined);
};

const legacyRoleIds = (roles: AccessRole[], module: AccessModuleShape) =>
	roles
		.filter(
			(role) =>
				!!module.objectId && (role.modules || []).includes(module.objectId)
		)
		.map((role) => role.objectId);

/** Role ids allowed for a module action. Empty means deny. */
export const allowedRoleIds = (
	module: AccessModuleShape,
	action: ModuleRoleAction,
	roles: AccessRole[]
): string[] => {
	const permission = readModulePermission(module);
	const configured = permission?.[action];
	if (permission == null || configured === undefined) {
		return legacyRoleIds(roles, module);
	}
	return configured;
};

export const anyRoleAllowed = (roles: AccessRole[], allowed: string[]) =>
	roles.some((role) => allowed.includes(role.objectId));

export const effectiveFieldRoleIds = (
	module: AccessModuleShape,
	field: AccessField | null | undefined,
	action: "read" | "write",
	roles: AccessRole[]
): string[] => {
	const override = field?.permission?.[action];
	if (override !== undefined) return override;
	return allowedRoleIds(module, action, roles);
};

export const canEnterModule = (roles: AccessRole[], module: AccessModuleShape) =>
	anyRoleAllowed(roles, allowedRoleIds(module, "access", roles));

export const grantsForClass = (
	roles: AccessRole[],
	className: string,
	now = Date.now()
) =>
	roles.flatMap((role) =>
		(role.access || []).filter(
			(grant) =>
				isActiveAccessGrant(grant, now) && grant.className === className
		)
	);

export const canEnterRecord = (
	roles: AccessRole[],
	className: string | null | undefined,
	recordId: string | null | undefined,
	now = Date.now()
) =>
	!!className &&
	!!recordId &&
	grantsForClass(roles, className, now).some((grant) => grant.id === recordId);

/** Record paths granted to one user on a module's subpages. */
export const pageGrantRecords = (
	modules: AccessModuleShape[] | null | undefined,
	userId: string | undefined
) => {
	if (!userId) return [];
	return (modules || []).flatMap((module) => {
		const pages =
			module.settings?.permission?.pages || module.permission?.pages || [];
		return pages.flatMap((grant) => {
			if (grant.userId !== userId || !grant.id || !grant.className) return [];
			if (module.connected_class && module.connected_class !== grant.className) {
				return [];
			}
			const path = recordAccessPath(module.path, grant.id);
			if (!path) return [];
			return [{ className: grant.className, id: grant.id, path }];
		});
	});
};

const canEnter = (
	roles: AccessRole[],
	module: AccessModuleShape,
	recordId?: string
) =>
	canEnterModule(roles, module) ||
	canEnterRecord(roles, module.connected_class, recordId);

export const canReadField = (
	roles: AccessRole[],
	module: AccessModuleShape,
	field: AccessField | null | undefined,
	recordId?: string
) => {
	if (!canEnter(roles, module, recordId)) return false;
	if (moduleUsesLegacy(module)) return true;
	return anyRoleAllowed(
		roles,
		effectiveFieldRoleIds(module, field, "read", roles)
	);
};

export const canWriteField = (
	roles: AccessRole[],
	module: AccessModuleShape,
	field: AccessField | null | undefined,
	recordId?: string,
	isCreate = false
) => {
	if (isCreate) {
		if (!canEnterModule(roles, module)) return false;
		if (moduleUsesLegacy(module)) return true;
		if (!anyRoleAllowed(roles, allowedRoleIds(module, "create", roles))) {
			return false;
		}
		return anyRoleAllowed(
			roles,
			effectiveFieldRoleIds(module, field, "write", roles)
		);
	}
	if (!canEnter(roles, module, recordId)) return false;
	if (moduleUsesLegacy(module)) return true;
	if (!anyRoleAllowed(roles, allowedRoleIds(module, "update", roles))) {
		return false;
	}
	return anyRoleAllowed(
		roles,
		effectiveFieldRoleIds(module, field, "write", roles)
	);
};

export const canCreateRecord = (roles: AccessRole[], module: AccessModuleShape) => {
	if (!canEnterModule(roles, module)) return false;
	if (moduleUsesLegacy(module)) return true;
	return anyRoleAllowed(roles, allowedRoleIds(module, "create", roles));
};

export const canUpdateRecord = (
	roles: AccessRole[],
	module: AccessModuleShape,
	recordId?: string
) => {
	if (!canEnter(roles, module, recordId)) return false;
	if (moduleUsesLegacy(module)) return true;
	return anyRoleAllowed(roles, allowedRoleIds(module, "update", roles));
};

/** A record grant does not allow delete. Legacy module membership does. */
export const canDeleteRecord = (
	roles: AccessRole[],
	module: AccessModuleShape,
	recordId?: string
) => {
	if (!canEnter(roles, module, recordId)) return false;
	if (moduleUsesLegacy(module)) return canEnterModule(roles, module);
	return anyRoleAllowed(roles, allowedRoleIds(module, "delete", roles));
};
