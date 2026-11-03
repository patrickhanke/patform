"use client";

import { ApolloNextAppProvider } from "@apollo/client-integration-nextjs";
import makeClient from "./client";
import { ApolloAppProviderProps } from "./types";

function ApolloAppProvider({
	children,
	uri,
	appId,
	restKey,
	useMasterKey
}: ApolloAppProviderProps) {
	return (
		<ApolloNextAppProvider
			makeClient={() => makeClient(uri, appId, restKey, useMasterKey)}
		>
			{children}
		</ApolloNextAppProvider>
	);
}

export default ApolloAppProvider;
