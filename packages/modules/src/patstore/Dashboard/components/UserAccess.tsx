"use client";

import { useContext, useMemo } from "react";
import {
	PatstoreAppContext,
	isActiveAccessGrant,
	modulesForAccessClass,
	recordAccessPath
} from "@repo/provider";
import UserAccessLink from "./UserAccessLink";

const UserAccess = () => {
	const { userRole, modules } = useContext(PatstoreAppContext);

	const items = useMemo(
		() =>
			(userRole?.access || [])
				.filter((grant) => isActiveAccessGrant(grant))
				.flatMap((grant) =>
				modulesForAccessClass(modules, grant.className).flatMap((module) => {
					const href = recordAccessPath(module.path, grant.id);
					if (!href) return [];
					return [
						{
							href,
							className: grant.className,
							id: grant.id,
							moduleName: module.name || grant.className,
							expiresAt: grant.expires_at
						}
					];
				})
			),
		[userRole?.access, modules]
	);

	if (items.length === 0) return null;

	return (
		<div className="content_element flex col gap-sm">
			<h2>Zugänge</h2>
			<div className="flex col gap-xs">
				{items.map((item) => (
					<UserAccessLink key={item.href} {...item} />
				))}
			</div>
		</div>
	);
};

export default UserAccess;
