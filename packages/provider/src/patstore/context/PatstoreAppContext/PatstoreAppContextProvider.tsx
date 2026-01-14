"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import PatstoreAppContext from "./PatstoreAppContext";
import {
	Module,
	PatstoreProject,
	PatstoreRoleClass,
	PatstoreUser
} from "@repo/types";
import { usePathname } from "next/navigation";
import { axiosclient } from "../../../general";

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

	const userRole = useMemo(() => {
		return roles?.find((role) => user?.roles?.includes(role.objectId));
	}, [roles, user]);

	console.log({ modules: project.modules });

	const appContextObject = useMemo(
		() => ({
			pageTitle,
			setPageTitle,
			project,
			currentModule,
			userRole,
			user,
			userLoading: !user.objectId ? true : false,
			modules: project.modules
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
