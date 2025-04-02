"use client";

import React, { useMemo, useState } from "react";
import PatstoreAppContext from "./PatstoreAppContext";
import { Module, PatstoreProject } from "@repo/types";
import { usePathname } from "next/navigation";

const AppContextProvider = ({
	project,
	children
}: {
	project: PatstoreProject;
	children: React.ReactNode;
}) => {
	const [pageTitle, setPageTitle] = useState();
	const pathname = usePathname();

	const currentModule = useMemo(() => {
		return project.modules.results.find(
			(module) => module.path === pathname
		) as Module;
	}, [pathname, project]);

	const appContextObject = useMemo(
		() => ({
			pageTitle,
			setPageTitle,
			project,
			currentModule,
			modules: project.modules.results
		}),
		[pageTitle, project, currentModule]
	);

	return (
		<PatstoreAppContext.Provider value={appContextObject}>
			{children}
		</PatstoreAppContext.Provider>
	);
};

export default AppContextProvider;
