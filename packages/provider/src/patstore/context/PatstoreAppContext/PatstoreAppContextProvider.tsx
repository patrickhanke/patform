"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import PatstoreAppContext from "./PatstoreAppContext";
import {
	Module,
	PatstoreProject,
	PatstoreRoleAccess,
	PatstoreRoleClass,
	PatstoreUser
} from "@repo/types";
import { usePathname } from "next/navigation";
import { axiosclient } from "../../../general";
import { useRoleForUser } from "../../../general/hooks/useRoleForUser";

const PatstoreAppContextProvider = ({
	project,
	roles,
	children
}: {
	project: PatstoreProject;
	roles: PatstoreRoleClass[];
	children: React.ReactNode;
}) => {
	const [pageTitle, setPageTitle] = useState();
	const [user, setUser] = useState<PatstoreUser>({} as PatstoreUser);
	const pathname = usePathname();

	const currentModule = useMemo(() => {
		const modules: Module[] = project.modules;

		return modules.find((module) =>
			pathname.includes(module?.path)
		) as Module;
	}, [pathname, project]);

	const getUser = useCallback(async () => {
		await axiosclient()
			.get("/users/me")

			.then((response) => {
				setUser(response.data);
			})

			.catch((error) => console.error(error.message));
	}, []);

	useEffect(() => {
		getUser();
	}, []);

	const { role: membership } = useRoleForUser(user?.objectId, project?.objectId);
	const matchedRole = useMemo(() => {
		return roles?.find((role) => role.objectId === membership?.objectId);
	}, [roles, membership?.objectId]);
	const [roleAccess, setRoleAccess] = useState<PatstoreRoleAccess[]>([]);

	useEffect(() => {
		if (!matchedRole?.objectId || !project?.objectId) {
			setRoleAccess([]);
			return;
		}
		let cancelled = false;
		const params = new URLSearchParams({
			className: "_Role",
			useMasterKey: "true",
			projectId: project.objectId,
			query: `"objectId":"${matchedRole.objectId}"`
		});
		fetch(`/api/data?${params}`)
			.then((response) => (response.ok ? response.json() : null))
			.then((body) => {
				if (cancelled) return;
				setRoleAccess(body?.results?.[0]?.access || []);
			})
			.catch(() => {
				if (!cancelled) setRoleAccess([]);
			});
		return () => {
			cancelled = true;
		};
	}, [matchedRole?.objectId, project?.objectId]);

	const userRole = useMemo(() => {
		if (!matchedRole) return matchedRole;
		return { ...matchedRole, access: roleAccess };
	}, [matchedRole, roleAccess]);

	const appContextObject = useMemo(
		() => ({
			pageTitle,
			setPageTitle,
			project,
			currentModule,
			userRole,
			user,
			userLoading: !user.objectId ? true : false,
			modules: project.modules,
			defaultLanguage: project?.settings?.default_language || "de-DE",
			languages: project?.settings?.languages || ["de-DE"]
		}),
		[pageTitle, project, currentModule, user, userRole]
	);

	return (
		<PatstoreAppContext.Provider value={appContextObject}>
			{children}
		</PatstoreAppContext.Provider>
	);
};

export default PatstoreAppContextProvider;
