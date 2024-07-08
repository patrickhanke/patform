'use client';

import { ApolloNextAppProvider } from '@apollo/experimental-nextjs-app-support/ssr';
import makeClient from './client';
import { ApolloAppProviderProps } from './types';

function ApolloAppProvider({ children , appId, masterKey }: ApolloAppProviderProps) {
	return (
		<ApolloNextAppProvider makeClient={() => makeClient(appId, masterKey)}>
			{children}
		</ApolloNextAppProvider>
	);
}

export default ApolloAppProvider;