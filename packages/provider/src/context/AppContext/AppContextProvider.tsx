'use client';

import React, { useMemo, useState } from 'react';
import AppContext from './AppContext';

const AppContextProvider = ({children} : {children: React.ReactNode}) => {
	const [pageTitle, setPageTitle] = useState();

	const appContextObject = useMemo(() => ({
		pageTitle,
		setPageTitle
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