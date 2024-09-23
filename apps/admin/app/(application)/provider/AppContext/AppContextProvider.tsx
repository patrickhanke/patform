'use client';

import React, { useMemo, useState } from 'react';
import AppContext from './AppContext';
import { Project } from '@repo/types';

const AppContextProvider = ({projects, children} : {projects: Project[],children: React.ReactNode}) => {
	const [pageTitle, setPageTitle] = useState();

	const appContextObject = useMemo(() => ({
		pageTitle,
		setPageTitle,
		projects,
		getCurrentProject: (projectId: string) => projects.find(project => project.objectId === projectId)
	}), [pageTitle, projects]);

	return (
		<AppContext.Provider
			value={appContextObject}
		>
			{children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;