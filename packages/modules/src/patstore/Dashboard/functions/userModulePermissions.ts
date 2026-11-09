import { Module, ModulePageAccess } from "@repo/types";
import { recordAccessPath } from "@repo/provider";

export type UserModulePermission = {
	href: string;
	className: string;
	id: string;
	moduleName: string;
};

const pageGrants = (module: Module): ModulePageAccess[] =>
	module.settings?.permission?.pages || module.permission?.pages || [];

/** Subpage grants on the project's modules that belong to this user. */
export const userModulePermissions = (
	modules: Module[] | null | undefined,
	userId: string | undefined
): UserModulePermission[] => {
	if (!userId) return [];

	return (modules || []).flatMap((module) =>
		pageGrants(module).flatMap((grant) => {
			if (grant.userId !== userId) return [];
			if (module.connected_class && module.connected_class !== grant.className) {
				return [];
			}
			const href = recordAccessPath(module.path, grant.id);
			if (!href) return [];
			return [
				{
					href,
					className: grant.className,
					id: grant.id,
					moduleName: module.name || grant.className
				}
			];
		})
	);
};
