import { ApolloClient, NormalizedCacheObject } from "@apollo/client";

export type ApolloAppProviderProps = {
    appId: string;
    masterKey: string;
    children: React.ReactNode;
};

export type makeClientProps = (appId: string, masterKey: string) => ApolloClient<NormalizedCacheObject>;