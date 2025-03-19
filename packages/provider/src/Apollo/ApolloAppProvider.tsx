"use client";

import { ApolloNextAppProvider } from "@apollo/experimental-nextjs-app-support";
import makeClient from "./client";
import { ApolloAppProviderProps } from "./types";

function ApolloAppProvider({
  children,
  uri,
  appId,
  restKey,
}: ApolloAppProviderProps) {
  return (
    <ApolloNextAppProvider makeClient={() => makeClient(uri, appId, restKey)}>
      {children}
    </ApolloNextAppProvider>
  );
}

export default ApolloAppProvider;
