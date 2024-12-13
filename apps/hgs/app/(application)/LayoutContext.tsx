'use client';

import { ApolloAppProvider, AppContextProvider } from '@provider';
import {  UserContextProvider } from '@repo/provider';
import React from 'react';

const LayoutContext = ({children}: {children: React.ReactNode}) => {
	return (
		<ApolloAppProvider>
			<UserContextProvider>
				<AppContextProvider>
					<React.StrictMode>
						{children}
					</React.StrictMode>
				</AppContextProvider>
			</UserContextProvider>
		</ApolloAppProvider>
	);
};

export default LayoutContext;