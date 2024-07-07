'use client';

import React, { useMemo, useState } from 'react';
import AppContext from './AppContext';
import { Project } from '@repo/types';

const AppContextProvider = ({project, children} : {project: Project,children: React.ReactNode}) => {
	const [pageTitle, setPageTitle] = useState();

	const appContextObject = useMemo(() => ({
		pageTitle,
		setPageTitle,
		project
	}), [pageTitle]);
	
	return (
		<AppContext.Provider
			value={appContextObject}
		>
			{children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;