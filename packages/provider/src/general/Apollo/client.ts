"use client";

import Cookies from "js-cookie";
import { ApolloLink, HttpLink } from "@apollo/client";

import {
	ApolloClient,
	InMemoryCache,
	SSRMultipartLink
} from "@apollo/client-integration-nextjs";
import { ClientHeaders, MakeClientProps } from "./types";

const SERVER_GRAPHQL_ROUTE = "/api/graphql";

const makeClient: MakeClientProps = (uri, appId, restKey, useMasterKey) => {
	const localToken = Cookies.get(process.env.SESSION_TOKEN as string);

	const token = localToken || "";

	// Master-key queries are sent to the app's own server route, which decides whether the
	// master key may be used. The key itself never reaches the browser.
	const headers: ClientHeaders = useMasterKey
		? { "x-use-master-key": "true" }
		: {
				"X-Parse-Application-Id": appId || "",
				"X-Parse-REST-API-Key": restKey || "",
				"X-Parse-Session-Token": token
			};

	const httpLink = new HttpLink({
		uri: useMasterKey ? SERVER_GRAPHQL_ROUTE : uri,
		headers
	});

	return new ApolloClient({
		cache: new InMemoryCache({
			typePolicies: {
				ObjectsQuery: {
					merge(existing, incoming, { mergeObjects }) {
						return mergeObjects(existing, incoming);
					}
				}
			},
			dataIdFromObject(responseObject) {
				return (responseObject.objectId as string) || undefined;
			}
		}),
		link:
			typeof window === "undefined"
				? ApolloLink.from([
						new SSRMultipartLink({
							stripDefer: true
						}),
						httpLink
					])
				: httpLink
	});
};

export default makeClient;
