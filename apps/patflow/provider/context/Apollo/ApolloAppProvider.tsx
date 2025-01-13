'use client';

import { ApolloNextAppProvider } from '@apollo/experimental-nextjs-app-support/ssr';
import React from 'react';
import makeClient from './client';

function ApolloAppProvider({ children }: React.PropsWithChildren) {
	
	return (
		<ApolloNextAppProvider makeClient={makeClient}>
			{children}
		</ApolloNextAppProvider>
	);
}

export default ApolloAppProvider;