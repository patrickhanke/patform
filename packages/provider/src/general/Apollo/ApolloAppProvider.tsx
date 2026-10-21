"use client";

import { ApolloNextAppProvider } from "@apollo/client-integration-nextjs";
import makeClient from "./client";
import { ApolloAppProviderProps } from "./types";

function ApolloAppProvider({
	children,
	uri,
	appId,
	restKey,
	masterKey
}: ApolloAppProviderProps) {
	return (
		<ApolloNextAppProvider
			makeClient={() => makeClient(uri, appId, restKey, masterKey)}
		>
			{children}
		</ApolloNextAppProvider>
	);
}

export default ApolloAppProvider;
