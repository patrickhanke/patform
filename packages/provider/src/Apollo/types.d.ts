import { generateGraphQLQuery, paramsHandler } from '@repo/provider';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { Filter } from '@repo/types';

type type = 'find' | 'get';
type objectName = 'Person' | 'Module';
type fields = Array<string>;

type QueryProps = {
    type: type, 
	objectName: objectName, 
	fields: fields,
	constraints?: Filter[]
}

type ParamsHandlerProps = {
    projectId: string, 
    filters: Filter[]
}

export type generateGraphQLQueryProps = (QueryProps) => ReturnType<typeof generateGraphQLQuery>;

export type ParamsHandlerType = (ParamsHandlerProps) => ReturnType<typeof paramsHandler>;

export type ApolloAppProviderProps = {
    appId: string;
    masterKey: string;
    children: React.ReactNode;
};

export type makeClientProps = (appId: string, masterKey: string) => ApolloClient<NormalizedCacheObject>;