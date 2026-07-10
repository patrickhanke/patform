"use client";

import { ApolloNextAppProvider } from "@apollo/experimental-nextjs-app-support";
import makeClient from "./client";
import { ApolloAppProviderProps } from "./types";

function ApolloAppProvider({
	children,
	uri,
	appId,
	restKey,
	masterKey
}: ApolloAppProviderProps) {
	console.log({ uri, appId, restKey, masterKey });
	return (
		<ApolloNextAppProvider
			makeClient={() => makeClient(uri, appId, restKey, masterKey)}
		>
			{children}
		</ApolloNextAppProvider>
	);
}

export default ApolloAppProvider;
