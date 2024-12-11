'use client';

import React from 'react';

interface ContextValues {
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    getData: CallableFunction
}

const UserFeedbackContext = React.createContext<ContextValues>({
	loading: false,
	setLoading: (): boolean => false,
	getData: (): ReadonlyArray<object> => []
});

export default UserFeedbackContext;