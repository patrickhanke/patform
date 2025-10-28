"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import PatstoreAppContext from "./PatstoreAppContext";
import { Module, PatstoreProject, PatstoreUser } from "@repo/types";
import { usePathname } from "next/navigation";
import { axiosclient } from "../../../general";

const PatstoreAppContextProvider = ({
	project,
	children
}: {
	project: PatstoreProject;
	children: React.ReactNode;
}) => {
	const [pageTitle, setPageTitle] = useState();
	const [user, setUser] = useState<PatstoreUser>({} as PatstoreUser);
	const pathname = usePathname();

	console.log({ project });

	const currentModule = useMemo(() => {
		return project.modules.results.find((module) =>
			pathname.includes(module.path)
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

	const appContextObject = useMemo(
		() => ({
			pageTitle,
			setPageTitle,
			project,
			currentModule,
			user,
			userLoading: !user.objectId ? true : false,
			modules: project.modules.results
		}),
		[pageTitle, project, currentModule, user]
	);

	return (
		<PatstoreAppContext.Provider value={appContextObject}>
			{children}
		</PatstoreAppContext.Provider>
	);
};

export default PatstoreAppContextProvider;
