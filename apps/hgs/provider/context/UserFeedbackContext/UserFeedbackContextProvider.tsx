'use client';

import React, { useCallback, useMemo, useState } from 'react';
import UserFeedbackContext from './UserFeedbackContext';
import getData from '../../data/getData';

const UserFeedbackContextProvider = ({children} : {children: React.ReactNode}) => {
	const [loading, setLoading] = useState(false);

	const getDataHandler =  useCallback(async ({className, query }: {className: string, query: string}) => {
		const data = await getData({className, query});
		return data;
	}, []);

	const userFeedbackContextObject = useMemo(() => ({
		loading,
		setLoading,
		getData: getDataHandler
	}), []);


	return (
		<UserFeedbackContext.Provider
			value={userFeedbackContextObject}
		>
			{children}
		</UserFeedbackContext.Provider>
	);
};

export default UserFeedbackContextProvider;