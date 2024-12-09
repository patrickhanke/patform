'use client';

import { ApolloAppProvider, AppContextProvider, UserContextProvider } from '@/provider';
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