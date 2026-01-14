import { generateGraphQLQuery, paramsHandler } from "@repo/provider";
import { ApolloClient, ApolloQueryResult } from "@apollo/client";
import { Classes, Filter } from "@repo/types";
import React from "react";

type type = "find" | "get";
type objectName = "Person" | "Module";
type fields = Array<string>;

type QueryProps = {
	type: type;
	objectName: string;
	queryName: string;
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

export type MakeClientProps = (
	uri: string,
	appId: string,
	restKey: string,
	masterKey?: string
) => ApolloClient;

export type ClientHeaders = {
	"X-Parse-Application-Id": string;
	"X-Parse-REST-API-Key": string;
	"X-Parse-Session-Token": string;
	"X-Parse-Master-Key"?: string;
	"Access-Control-Allow-Origin"?: string;
};

export type ApolloRefetch = () => Promise<ApolloQueryResult<Classes>>;

export type UseFindDataHook<T extends Classes> = (P: {
	objectName: string;
	fields: string[];
	filters?: Filter[];
	limit?: number;
	skip?: number;
	order?: string;
	moduleId?: string;
	projectId?: string;
}) => {
	loading: boolean;
	data: T[];
	refetch: ApolloRefetch;
	count: number;
};

export type UseGetDataHook<T extends Classes> = (P: {
	objectName: string;
	fields: string[];
	id?: string;
	skip?: boolean;
}) => {
	loading: boolean;
	data: T | null;
	refetch: ApolloRefetch;
	error: ApolloError;
};
