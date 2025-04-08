import { generateGraphQLQuery, paramsHandler } from "@repo/provider";
import {
	ApolloClient,
	ApolloQueryResult,
	NormalizedCacheObject
} from "@apollo/client";
import { Filter } from "@repo/types";
import React from "react";

type type = "find" | "get";
type objectName = "Person" | "Module";
type fields = Array<string>;

type QueryProps = {
	type: type;
	objectName: string;
	fields: fields;
	constraints?: Filter[];
};

type ParamsHandlerProps = {
	projectId?: string;
	moduleId?: string;
	filters?: Filter[];
};

export type GenerateGraphQLQueryFunction = (
	T: QueryProps
) => ReturnType<typeof generateGraphQLQuery>;

export type ParamsHandlerType = (
	T: ParamsHandlerProps
) => ReturnType<typeof paramsHandler>;

export type ApolloAppProviderProps = {
	uri: string;
	appId: string;
	restKey: string;
    masterKey?: string;
	children: React.ReactNode;
};

export type makeClientProps = (
	uri: string,
	appId: string,
	restKey: string
) => ApolloClient<NormalizedCacheObject>;

export type ApolloRefetch = () => Promise<ApolloQueryResult<any>>;
